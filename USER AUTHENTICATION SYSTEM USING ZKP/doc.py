import hashlib
import random

# Constants for modular arithmetic
p = 51  # Prime modulus
g = 7   # Base

# Function to hash a password
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Server class handles the registration and authentication process
class Server:
    def __init__(self):
        self.database = {}  # Stores user_id: hashed_password pairs

    def register_user(self, user_id, password):
        # Hash the user's password and store it in the database
        hashed_password = hash_password(password)
        self.database[user_id] = hashed_password
        print(f"User '{user_id}' registered with hashed password '{hashed_password}'")

    def generate_challenge(self):
        return random.randint(1, 1000)

    def verify_proof(self, user_id, t, s, challenge):
        hashed_password = self.database.get(user_id)
        if not hashed_password:
            print(f"User '{user_id}' not found.")
            return False

        x = int(hashed_password, 16)  

        # Compute g^s mod p
        g_s = pow(g, s, p)

        # Compute t * g^(-challenge * x) mod p
        # Calculate modular inverse of g^challenge*x
        # Compute the exponent as -challenge * x
        exp = -challenge * x % (p - 1)
        g_inv = pow(g, exp, p)
        
        # Compute expected value
        expected = (t * g_inv) % p
        print(f"{g_s}")
        print(f"{expected}")

        if g_s == expected:
            print(f"User '{user_id}' authenticated successfully.")
            return True
        else:
            print(f"Authentication failed for user '{user_id}'.")
            return False

# User class handles generating proofs based on their password
class User:
    def __init__(self, user_id, password):
        self.user_id = user_id
        self.password = password
        self.hashed_password = hash_password(password)

    def generate_proof(self, challenge):
        # Generate a random value `r`
        r = random.randint(1, 1000)

        # Convert hashed password from hex to integer
        x = int(self.hashed_password, 16)  # Use a slice for demonstration

        # Compute commitment t = g^r mod p
        t = pow(g, r, p)

        # Compute response s = r + challenge * x
        s = (r + challenge * x) % (p - 1)  # Use p-1 to fit in modular range

        # Return the proof (t, s)
        return t, s

# Main program demonstrating user registration and authentication
def main():
    # Create server instance
    server = Server()

    # Step 1: User registration
    print("User Registration")
    user_id = input("Enter a user ID: ")
    password = input("Enter a password: ")
    server.register_user(user_id, password)

    # Step 2: User authentication process
    print("\nUser Authentication")
    user_id_auth = input("Enter your user ID: ")
    password_auth = input("Enter your password: ")

    # Create a User object for authentication
    user = User(user_id_auth, password_auth)

    # Server generates a challenge
    challenge = server.generate_challenge()
    print(f"Server generated challenge: {challenge}")

    # User generates proof
    t, s = user.generate_proof(challenge)
    print(f"User generated proof: t={t}, s={s}")

    # Server verifies proof
    server.verify_proof(user_id_auth, t, s, challenge)

if __name__ == "__main__":
    main()
