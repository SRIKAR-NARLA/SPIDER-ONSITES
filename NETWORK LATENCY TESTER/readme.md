# Simple Network Latency Tester

This is a simple Python program that measures network latency by sending ICMP ping requests to a specified server or IP address. The program pings the target 5 times and displays the average latency and packet loss percentage.

## Features

- Sends 5 ICMP ping requests to a specified target (IP address or hostname).
- Measures and displays:
  - Average latency in milliseconds.
  - Packet loss percentage.

## Prerequisites

- Python 3.x
- The `ping3` library for sending ICMP ping requests.

## Installation

1. **Clone the repository** (if applicable):
    ```bash
    git clone https://github.com/yourusername/network-latency-tester.git
    cd network-latency-tester
    ```

2. **Install the required library**:
    Install the `ping3` library using `pip`:
    ```bash
    pip install ping3
    ```

## Usage

1. **Run the program**:
   You can run the program directly from the command line:
   ```bash
   python ping_tester.py
