#!/bin/bash

# Check if a command is provided
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <command>"
    exit 1
fi

# Combine all arguments into a single command
input_command="$@"

# Replace the specified path
modified_command=$(echo "$input_command" | sed 's|/home/yendric/Code/uploads|/var/www/html|g')

# Prefix the command with "./vendor/bin/sail php" and execute it
full_command="./vendor/bin/sail php $modified_command"

# Execute the final command
eval "$full_command"
