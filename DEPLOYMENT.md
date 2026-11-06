# new-api（MAKNAA 主页）部署文档

本文档说明如何在**全新服务器**上用 **docker-compose** 部署本项目。

与仓库自带的 `docker-compose.yml`（拉取官方公共镜像 `calciumion/new-api`，**不含** MAKNAA 主页）不同，本方案用 `docker-compose.build.yml` **从本源码树构建镜像**，MAKNAA 落地页会被编译进前端产物并内嵌进二进制。

---

## 0. 这个部署包是什么

- **构建方式**：官方 `Dockerfile` 多阶段源码构建（`bun install` → `bun run build` → `go build`），在**服务器上**联网完成。
- **数据库**：默认 SQLite，数据文件落在宿主机 `./data/`，重启不丢。可选切 MySQL / PostgreSQL。
- **缓存/限流**：默认自带一个独立 Redis 容器（可删）。
- **端口**：容器内 3000，映射到宿主机 3000。

> 为什么必须在服务器上构建：MAKNAA 主页是前端源码改动，只有重新 `bun run build` 才会把它编进 `web/dist`，再由 `go:embed` 内嵌进二进制。直接拉官方镜像不会有这个主页。

---

## 1. 服务器前置要求

| 项目 | 要求 | 说明 |
|---|---|---|
| 操作系统 | Linux x86_64（amd64） | 本方案默认构建 amd64；ARM 服务器见 §8 |
| Docker | ≥ 20.10 | `docker version` 确认 |
| docker-compose | v1（≥1.27）或 v2 | v1/v2 都支持，见 §3 的命令差异 |
| 内存 | ≥ 4 GB | 构建阶段 `bun install` + `go build` 较吃内存 |
| 磁盘 | ≥ 10 GB 可用 | 镜像 + 构建缓存 + 数据 |
| 网络 | 能访问 Docker Hub、npm registry、Go module proxy | 构建期联网；离线/国内镜像见 §8 |

先在服务器上确认工具就绪：

```bash
docker version
docker-compose version   # 或 docker compose version（v2）
```

---

## 2. 把源码传到服务器

本部署包是一个**源码压缩包**（不含 `node_modules` / `dist` / 二进制等构建产物，构建时会重新生成）。

### 2.1 上传

在你**本机**（开发机）执行，把压缩包传到服务器（示例用 scp，端口/用户/路径按实际改）：

```bash
scp new-api-maknaa-src.tar.gz user@服务器IP:/home/user/
```

### 2.2 解压

登录服务器后：

```bash
cd /home/user
mkdir -p new-api && tar -xzf new-api-maknaa-src.tar.gz -C new-api
cd new-api
```

解压后目录里应有：`Dockerfile`、`docker-compose.build.yml`、`main.go`、`go.mod`、`web/`、`relaykit/`、`tokenkit/`、`DEPLOYMENT.md` 等。

> 校验包完整性（可选）：`ls -la` 确认 `web/src/features/home/components/maknaa/` 存在——这是 MAKNAA 主页源码。

---

## 3. 构建并启动

### 3.1 首次构建 + 启动

```bash
# docker-compose v1
docker-compose -f docker-compose.build.yml up -d --build

# 或 Compose v2（docker compose，中间是空格）
docker compose -f docker-compose.build.yml up -d --build
```

首次构建需拉基础镜像、装依赖、编译前后端，**耗时约 5–15 分钟**（取决于网络与机器）。看到 `new-api` 与 `new-api-redis` 两个容器 `Up` 即成功。

### 3.2 确认运行状态

```bash
docker-compose -f docker-compose.build.yml ps
docker-compose -f docker-compose.build.yml logs -f new-api
```

日志里出现类似 `New API listening on 0.0.0.0:3000` / 数据库迁移完成即可 `Ctrl+C` 退出日志跟随。

### 3.3 访问

浏览器打开：

```
http://服务器IP:3000
```

首页即 **MAKNAA 落地页**。

---

## 4. 首次初始化（创建管理员）

1. 首次访问会跳转到 `/setup` 初始化向导。
2. 按提示创建 **root 管理员**账号（用户名 + 密码 + 邮箱）。
3. 完成后用该账号登录，进入控制台。

> 初始化状态记录在数据库（`setups` 表）。若要重置向导（例如测试），见 §7.4。

---

## 5. MAKNAA 联系表单的收件地址（构建期配置，重要）

主页「Contact / Send an Inquiry」表单默认提交到源站的第三方 Formspree 账户（`https://formspree.io/f/mnpaaewe`）。

- 如果这个部署**不属于**该 Formspree 账户，访客询盘会发进**别人的邮箱**。
- 该地址是**构建期变量** `VITE_MAKNAA_INQUIRY_ENDPOINT`，在 `bun run build` 时被烧进前端 bundle，**运行期改环境变量无效**。

### 改法（构建前设置）

在服务器上、执行 §3 构建命令**之前**，导出该变量指向你自己的表单后端：

```bash
export VITE_MAKNAA_INQUIRY_ENDPOINT="https://formspree.io/f/你自己的ID"
docker-compose -f docker-compose.build.yml build --no-cache
docker-compose -f docker-compose.build.yml up -d
```

> 注意：docker build 默认不继承宿主机环境变量。若上面方式未生效，需把它作为构建参数传入（在 `docker-compose.build.yml` 的 `build:` 下加 `args`，或临时用
> `docker build --build-arg VITE_MAKNAA_INQUIRY_ENDPOINT=... -t maknaa-new-api:latest .`
> 再 `docker-compose up -d`）。

- **置空**（`export VITE_MAKNAA_INQUIRY_ENDPOINT=""`）：表单降级为 `mailto:` 链接，不假装提交，也不会外发到默认账户。
- 不改：沿用源站默认地址（仅当你确实拥有该 Formspree 账户时才合适）。

---

## 6. 上线前必改的安全项

编辑 `docker-compose.build.yml` 的 `environment:`，改完重新 `up -d`：

| 变量 | 必改？ | 说明 |
|---|---|---|
| `SESSION_SECRET` | **必须** | 改成一段长随机串。不设则每次重启重新生成，登录会话全部失效；多节点部署各节点必须一致。生成：`openssl rand -hex 32` |
| Redis 密码 | **必须** | `REDIS_CONN_STRING` 与 redis 服务 `--requirepass` 两处要一致，且都改掉默认值 `ChangeMe_RedisPass` |
| `SESSION_COOKIE_SECURE=true` | 走 HTTPS 时**必须** | 启用 Secure Refresh Cookie + 严格 Origin 防护。**不设时 refresh/logout 的 CSRF 防护是关闭的**，仅限本地 HTTP |
| `SESSION_COOKIE_TRUSTED_URL` | 当上面为 true 时**必填** | 精确的公网 HTTPS Origin，如 `https://api.yourdomain.com`；不支持通配符/路径 |
| 数据库密码 | 用 MySQL/PG 时 | `SQL_DSN` 里的密码改掉默认值 |

**反向代理 + HTTPS**：本服务监听 3000。生产建议在前面放 Nginx/Caddy 做 TLS 终止，反代到 `http://127.0.0.1:3000`，并设置上面的 `SESSION_COOKIE_SECURE` / `SESSION_COOKIE_TRUSTED_URL`。

---

## 7. 日常运维

所有命令都带 `-f docker-compose.build.yml`（因为用的不是默认的 compose 文件）。

### 7.1 查看日志

```bash
docker-compose -f docker-compose.build.yml logs -f new-api      # 应用日志
docker-compose -f docker-compose.build.yml logs -f redis        # Redis 日志
```

应用日志也写在宿主机 `./data/logs/`（compose 里 `--log-dir /data/logs`）。

### 7.2 重启 / 停止

```bash
docker-compose -f docker-compose.build.yml restart new-api      # 重启应用
docker-compose -f docker-compose.build.yml down                 # 停止并删容器（数据保留在 ./data）
docker-compose -f docker-compose.build.yml up -d                # 再次启动
```

### 7.3 更新代码后重新构建

替换源码后：

```bash
docker-compose -f docker-compose.build.yml build --no-cache
docker-compose -f docker-compose.build.yml up -d
```

### 7.4 备份 / 重置

- **备份**：停止后打包 `./data/`（含 SQLite 库与日志）。SQLite 在线备份可用 `sqlite3 ./data/new-api.db ".backup '/path/backup.db'"`。
- **完全重置**（清空所有数据，慎用）：

```bash
docker-compose -f docker-compose.build.yml down
rm -rf ./data
docker-compose -f docker-compose.build.yml up -d
```

---

## 8. 网络受限 / 离线 / 架构差异

### 8.1 国内网络（拉镜像或装依赖慢/失败）

官方 `Dockerfile` 用 Docker Hub 镜像源、npm 官方源、Go 官方 proxy。若服务器在国内，构建可能卡在拉取或下载。应对：

- **基础镜像**：把 `Dockerfile` 三个 `FROM` 的镜像地址换成国内镜像源（如 DaoCloud：`docker.m.daocloud.io/library/debian:bookworm-slim` 等）。
- **Go module proxy**：构建前在 `Dockerfile` 的 `builder2` 阶段加 `ENV GOPROXY=https://goproxy.cn,direct`。
- **npm/bun**：为 `bun install` 配置国内 registry（如 `https://registry.npmmirror.com`）。

> 本部署包默认使用官方源，未内置国内镜像，以保持与上游一致；按上面提示按需修改 `Dockerfile` 即可。

### 8.2 完全离线服务器

服务器无法联网时无法用本方案（源码构建必须联网装依赖）。两个替代路径：

1. 在**能联网的机器**上 `docker-compose build` 出镜像，`docker save maknaa-new-api:latest -o image.tar`，传到离线机 `docker load -i image.tar`，再 `up -d`（此时不带 `--build`）。
2. 或沿用「本地交叉编译二进制 + 极简运行时镜像」方案（只需在离线机上拉一个 debian 基础镜像）。

### 8.3 ARM64 服务器

`docker-compose.build.yml` 默认在 amd64 上构建。ARM 服务器上：官方 `Dockerfile` 用 `TARGETARCH` 参数，正常 `up -d --build` 会构建对应架构；若跨架构构建需 docker buildx（部分老服务器无 buildx）。

---

## 9. 切换数据库（可选）

默认 SQLite 足够单机使用。要换 MySQL / PostgreSQL，编辑 `docker-compose.build.yml`：

1. 注释掉 `SQLITE_PATH` 那一行。
2. 取消注释并填写对应的 `SQL_DSN`：

   ```yaml
   # MySQL
   - SQL_DSN=root:YourDbPass@tcp(mysql:3306)/newapi?parseTime=true
   # 或 PostgreSQL
   - SQL_DSN=postgres://postgres:YourDbPass@postgres:5432/newapi
   ```

3. 自行补一个 `mysql` / `postgres` 服务（可参考仓库根 `docker-compose.yml` 里注释掉的示例），或指向已有的数据库实例。
4. `up -d` 重启。

> 日志库可单独用 `LOG_SQL_DSN` 指向另一个库（含 ClickHouse）。不设置则与主库共用。

---

## 10. 常见问题

| 现象 | 排查 |
|---|---|
| `up -d --build` 卡在 `bun install` / `go mod download` | 服务器网络问题，见 §8.1 换国内源 |
| 端口 3000 被占用 | 改 compose 里 `ports` 左侧宿主机端口，如 `"8080:3000"` |
| 首页不是 MAKNAA 而是旧页 | 构建未生效：确认用的是 `-f docker-compose.build.yml` 且带了 `--build`；确认源码包含 `web/src/features/home/components/maknaa/` |
| 登录后一会就掉线 / 重启后要重新登录 | 未设 `SESSION_SECRET`，见 §6 |
| 走 HTTPS 但 cookie 报警 / 无法刷新会话 | 设 `SESSION_COOKIE_SECURE=true` + `SESSION_COOKIE_TRUSTED_URL`，见 §6 |
| 联系表单提交没反应或发错邮箱 | 见 §5，`VITE_MAKNAA_INQUIRY_ENDPOINT` 是构建期变量 |
| healthcheck 一直 unhealthy | `logs -f new-api` 看启动错误；确认 3000 端口未被占用、数据库可连 |

---

## 附：本方案涉及的文件

| 文件 | 作用 |
|---|---|
| `Dockerfile` | 官方多阶段源码构建（**未修改**，与上游一致） |
| `docker-compose.build.yml` | 本方案专用 compose：从源码构建 + SQLite + Redis + 安全项占位 |
| `docker-compose.yml` | 仓库自带，拉官方公共镜像，**不含** MAKNAA 主页（本方案不用它） |
| `web/src/features/home/components/maknaa/` | MAKNAA 落地页 React 源码 |
| `web/src/features/home/maknaa-content.ts` | 主页文案与表单端点配置 |
| `web/src/styles/maknaa-home.css` | 主页深色主题样式 |
