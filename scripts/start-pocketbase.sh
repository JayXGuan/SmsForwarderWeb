#!/bin/bash

# PocketBase 启动脚本
# 自动下载并启动 PocketBase 服务

PB_DIR="pb"
PB_DATA_DIR="pb_data"
PB_EXEC="$PB_DIR/pocketbase"
PB_VERSION="0.22.8"  # 使用最新的稳定版本
PB_PORT="8090"

# 创建目录
mkdir -p "$PB_DIR"
mkdir -p "$PB_DATA_DIR"

# 检测操作系统和架构
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin) OS="darwin" ;;
  Linux)  OS="linux" ;;
  *)      echo "不支持的操作系统: $OS"; exit 1 ;;
esac

case "$ARCH" in
  x86_64|amd64)   ARCH="amd64" ;;
  arm64|aarch64)  ARCH="arm64" ;;
  *)              echo "不支持的架构: $ARCH"; exit 1 ;;
esac

PB_ZIP="pocketbase_${PB_VERSION}_${OS}_${ARCH}.zip"
PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/${PB_ZIP}"

# 检查是否已下载
if [ ! -f "$PB_EXEC" ]; then
  echo "正在下载 PocketBase ${PB_VERSION} (${OS}_${ARCH})..."
  
  # 下载
  curl -L "$PB_URL" -o "$PB_DIR/$PB_ZIP"
  
  # 解压
  unzip -o "$PB_DIR/$PB_ZIP" -d "$PB_DIR"
  
  # 清理
  rm "$PB_DIR/$PB_ZIP"
  
  # 设置权限
  chmod +x "$PB_EXEC"
  
  echo "PocketBase 下载完成!"
fi

# 启动 PocketBase
echo "正在启动 PocketBase (端口: ${PB_PORT})..."
echo "数据目录: ${PB_DATA_DIR}"
echo "管理面板: http://127.0.0.1:${PB_PORT}/_/"

# 使用 serve 命令启动，指定数据目录
"$PB_EXEC" serve --http="127.0.0.1:${PB_PORT}" --dir="$PB_DATA_DIR"