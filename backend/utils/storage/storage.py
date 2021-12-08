import os

import utils.storage.fs as storage_fs


class Storage:
    def __init__(self, method):
        if method == "fs":
            self.method = storage_fs
        else:
            raise Exception("Unknown storage method")

    def create(self, path):
        return self.method.create(path)

    def push_part(self, path, filename, data, part):
        return self.method.push_part(path, filename, data, part)

    def finalize(self, path, filename):
        return self.method.finalize(path, filename)

    def get_url(self, path, filename):
        return self.method.get_url(path, filename)


storage = Storage(os.environ.get("STORAGE_METHOD", "fs"))
