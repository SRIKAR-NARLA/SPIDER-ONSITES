from ping3 import ping

def send_request(target):
    response_time = ping(target)
    return response_time

def display_result(times, total_pings):
    successful_pings = len([time for time in times if time is not None])
    packet_loss = (1 - (successful_pings / total_pings)) * 100
    average_latency = sum([time for time in times if time is not None]) / successful_pings if successful_pings > 0 else None

    if average_latency:
        print(f"Average Latency: {average_latency * 1000:.2f} ms")  
    else:
        print("No successful pings.")

    print(f"Packet Loss: {packet_loss:.2f}%")

def main():
    target = "8.8.8.1"  
    total_pings = 5
    times = []

    for i in range(total_pings):
        print(f"Pinging {target}... Attempt {i+1}")
        response_time = send_request(target)
        times.append(response_time)
        if response_time is not None:
            print(f"Reply from {target}: time={response_time * 1000:.2f} ms")
        else:
            print(f"Request timed out.")

    print("\nPing statistics:")
    display_result(times, total_pings)

if __name__ == "__main__":
    main()
