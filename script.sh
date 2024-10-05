#!/bin/bash

# Display current date and time
echo "Current Date and Time: $(date)"

# Display hostname
echo "Hostname: $(hostname)"

# Display the current user
echo "Current User: $(whoami)"

# Display all logged-in users
echo "Logged-in Users:"
who

# Display system uptime
echo "System Uptime: $(uptime -p)"

# Display operating system information
echo "Operating System Information: $(uname -a)"

# Display disk usage
echo "Disk Usage:"
df -h

# Display memory usage
echo "Memory Usage:"
free -h
