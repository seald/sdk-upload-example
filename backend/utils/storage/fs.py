import os
from glob import glob

from encryptedupload.settings import BASE_DIR

base_dir = os.path.realpath(
    os.environ.get("STORAGE_FS_BASE_DIR", os.path.join(BASE_DIR, "..", "data"))
)
static_url = os.environ.get("STORAGE_FS_STATIC_URL", "/data")


def create(path):
    os.makedirs(os.path.join(base_dir, path), exist_ok=True)


def push_part(path, filename, data, part):
    filepath = os.path.join(base_dir, path, f"{filename}.part{part:05}")
    with open(filepath, "wb") as f:
        f.write(data)


def finalize(path, filename):
    filepath = os.path.join(base_dir, path, f"{filename}")
    with open(filepath, "wb") as f:
        parts_files = glob(f"{filepath}.part*")
        for part_file in parts_files:
            with open(part_file, "rb") as g:
                f.write(g.read())
            os.remove(part_file)


def get_url(path, filename):
    filepath = f"{path}/{filename}"
    return f"{static_url}/{filepath}"
