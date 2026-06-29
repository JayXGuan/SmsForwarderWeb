@echo off
REM PocketBase 启动脚本 (Windows)
REM 自动下载并启动 PocketBase 服务

set PB_DIR=pb
set PB_DATA_DIR=pb_data
set PB_EXEC=%PB_DIR%\pocketbase.exe
set PB_VERSION=0.22.8
set PB_PORT=8090

REM 创建目录
if not exist "%PB_DIR%" mkdir "%PB_DIR%"
if not exist "%PB_DATA_DIR%" mkdir "%PB_DATA_DIR%"

REM 检查是否已下载
if not exist "%PB_EXEC%" (
    echo 正在下载 PocketBase %PB_VERSION% (windows_amd64)...
    
    set PB_ZIP=pocketbase_%PB_VERSION%_windows_amd64.zip
    set PB_URL=https://github.com/pocketbase/pocketbase/releases/download/v%PB_VERSION%/%PB_ZIP%
    
    REM 下载
    curl -L %PB_URL% -o %PB_DIR%\%PB_ZIP%
    
    REM 解压 (需要 PowerShell)
    powershell -Command "Expand-Archive -Path '%PB_DIR%\%PB_ZIP%' -DestinationPath '%PB_DIR%' -Force"
    
    REM 清理
    del "%PB_DIR%\%PB_ZIP%"
    
    echo PocketBase 下载完成!
)

REM 启动 PocketBase
echo 正在启动 PocketBase (端口: %PB_PORT%)...
echo 数据目录: %PB_DATA_DIR%
echo 管理面板: http://127.0.0.1:%PB_PORT%/_/

REM 使用 serve 命令启动
%PB_EXEC% serve --http=127.0.0.1:%PB_PORT% --dir=%PB_DATA_DIR%