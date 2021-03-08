import os
import json


def save_json(file_name, obj):
    with open(file_name, "w") as f:
        f.write(json.dumps(obj))


def load_json(file_name, default=None):
    if not os.path.exists(file_name):
        print(f"{file_name} missing")
        return default
    with open(file_name) as f:
        content = f.read()
        if not content:
            print(f"{file_name} empty")
            return default
        try:
            json_content = json.loads(content)
            return json_content
        except json.decoder.JSONDecodeError:
            print(f"{file_name} corrupted")
            return default
