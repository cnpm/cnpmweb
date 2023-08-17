#!/bin/bash

PROCESS_NAME="cnpmweb/node_modules"

# 使用 pgrep 查找包含提供名称的进程
PIDS=$(pgrep -f "$PROCESS_NAME")

# 如果找到了进程，就杀死它们
if [ ! -z "$PIDS" ]; then
    echo "Killing processes: $PIDS"
    pkill -f "$PROCESS_NAME"
else
    echo "No processes found containing '$PROCESS_NAME'."
fi

nohup npm run start &
