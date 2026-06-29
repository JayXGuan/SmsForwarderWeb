#!/bin/bash

# 拉取Docker镜像脚本
# 每一步都依赖前一步的成功执行

set -e  # 任何命令失败时立即退出

echo "========== 步骤 1/3: 执行 Docker 登录 =========="
echo "请输入密码："
docker login ccr.ccs.tencentyun.com --username=1475058348
if [ $? -ne 0 ]; then
    echo "❌ Docker 登录失败，终止脚本"
    exit 1
fi
echo "✅ Docker 登录成功"

echo ""
echo "========== 步骤 2/3: 拉取 Docker 镜像 =========="
docker pull ccr.ccs.tencentyun.com/other_biz/smsweb:latest
if [ $? -ne 0 ]; then
    echo "❌ Docker 镜像拉取失败，终止脚本"
    exit 1
fi
echo "✅ Docker 镜像拉取成功"

echo ""
echo "========== 步骤 3/3: 退出 Docker 登录 =========="
docker logout ccr.ccs.tencentyun.com
if [ $? -ne 0 ]; then
    echo "⚠️ Docker 登出失败，但流程已完成"
else
    echo "✅ Docker 登出成功"
fi

echo ""
echo "========== 所有步骤执行完成 =========="