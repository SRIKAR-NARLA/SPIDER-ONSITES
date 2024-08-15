import hashlib
import random

p = 51  # Prime modulus
g = 7   # Base

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

class Server:
    def __init__(self):
        self.database = {}  # Stores user_id: hashed_password pairs

    def register_user(self, user_id, password):
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

        g_s = pow(g, s, p)

        exp = -challenge * x % (p - 1)
        g_inv = pow(g, exp, p)
        
        expected = (t * g_inv) % p
        print(f"{g_s}")
        print(f"{expected}")

        if g_s == expected:
            print(f"User '{user_id}' authenticated successfully.")
            return True
        else:
            print(f"Authentication failed for user '{user_id}'.")
            return False

class User:
    def __init__(self, user_id, password):
        self.user_id = user_id
        self.password = password
        self.hashed_password = hash_password(password)

    def generate_proof(self, challenge):
        r = random.randint(1, 1000)

        x = int(self.hashed_password, 16)  

        t = pow(g, r, p)

        s = (r + challenge * x) % (p - 1)  
        return t, s

def main():
    server = Server()

    print("User Registration")
    user_id = input("Enter a user ID: ")
    password = input("Enter a password: ")
    server.register_user(user_id, password)

    print("\nUser Authentication")
    user_id_auth = input("Enter your user ID: ")
    password_auth = input("Enter your password: ")

    user = User(user_id_auth, password_auth)

    challenge = server.generate_challenge()
    print(f"Server generated challenge: {challenge}")

    t, s = user.generate_proof(challenge)
    print(f"User generated proof: t={t}, s={s}")

    server.verify_proof(user_id_auth, t, s, challenge)

if __name__ == "__main__":
    main()
