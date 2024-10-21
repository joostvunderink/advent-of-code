import file_tools
import itertools
from functools import reduce
import pprint

test = {
    "/": {
        "type": "dir",
        "size": 123,
        "dirs": {
            "x": {
                "type": "dir",
                "size": 123,
                "dirs": {
                },
                "files": {
                },
            }
        },
        "files": {
            "a": {
                "type": "dir",
                "size": 123,
            },
            "b": {
                "type": "file",
                "size": 123,
            },
        }
    }
}

def enter_dir(tree, cur, line):
    (_, _, dir_name) = line.split(" ")
    if dir_name == "..":
        return cur["parent"]

    return cur["dirs"][dir_name]

def add_dir(tree, cur, line):
    (_, dir_name) = line.split(" ")

    if dir_name not in cur["dirs"]:
        cur["dirs"][dir_name] = {
            "name": dir_name,
            "path": cur["path"] + "/" + dir_name,
            "type": "dir",
            "size": 0,
            "dirs": {},
            "files": {},
            "parent": cur,
        }

def add_file(tree, cur, line):
    (filesize, filename) = line.split(" ")
    filesize = int(filesize)
    cur["files"][filename] = {
        "name": filename,
        "type": "file",
        "size": filesize,
    }

    cur["size"] += filesize

    # add this filesize to all parent folder sizes
    temp = cur
    while temp["parent"] is not None:
        temp = temp["parent"]
        temp["size"] += filesize

def process_file(filename):
    tree = {
        "/": {
            "name": "/",
            "path": "",
            "type": "dir",
            "size": 0,
            "dirs": {},
            "files": {},
            "parent": None,
        }
    }
    cur = tree["/"]
    with open(filename, "r") as file:
        for line in file:
            line = line.strip()
            print(line)
            # print(tree)
            if line == "$ cd /":
                pass
            elif line.startswith("$ cd"):
                cur = enter_dir(tree, cur, line)
            elif line.startswith("$ ls"):
                pass
            elif line.startswith("dir"):
                add_dir(tree, cur, line)
            else:
                add_file(tree, cur, line)
                

    return tree

def find_subdirs_smaller_than(dir, maxsize):
    subdirs = []
    cur = dir

    # print("find it: " + cur["path"] + " -> " + str(cur["size"]))
    if cur["size"] <= maxsize:
        subdirs.append(cur)

    for subdir_name in cur["dirs"]:
        small_subdirs = find_subdirs_smaller_than(cur["dirs"][subdir_name], maxsize)
        for s in small_subdirs:
            subdirs.append(s)

    return subdirs

def find_subdirs_greater_than(dir, minsize):
    subdirs = []
    cur = dir

    # print("find it: " + cur["path"] + " -> " + str(cur["size"]))
    if cur["size"] >= minsize:
        subdirs.append(cur)

    for subdir_name in cur["dirs"]:
        small_subdirs = find_subdirs_greater_than(cur["dirs"][subdir_name], minsize)
        for s in small_subdirs:
            subdirs.append(s)

    return subdirs

def main():
    tree = process_file(file_tools.get_input_filename(__file__))

    # pos2 = process_file2(file_tools.get_input_filename(__file__))
    print("Part one:")
    # pprint.pprint(tree)
    small_subdirs = find_subdirs_smaller_than(tree["/"], 100000)
    print("\n\n-------- the result: ", len(small_subdirs))
    # print(small_subdirs)
    sum = 0
    for i, s in enumerate(small_subdirs):
        print(i, s["name"], s["size"])
        sum += s["size"]
    print(sum)

    # print(reduce(lambda a, b: a["size"] + b["size"], small_subdirs))

    total_space = 70000000
    required_space = 30000000
    used_space = tree["/"]["size"]
    min_space_to_delete = required_space - (total_space - used_space)
    tree = process_file(file_tools.get_input_filename(__file__))
    big_subdirs = find_subdirs_greater_than(tree["/"], min_space_to_delete)
    big_subdirs = sorted(big_subdirs, key=lambda x: x["size"])

    print("used space", used_space)
    print("min to delete", min_space_to_delete)
    print(len(big_subdirs))
    print("Part two:", big_subdirs[0]["name"], big_subdirs[0]["size"])
    # for i, s in enumerate(big_subdirs):
    #     print(i, s["name"], s["size"])

if __name__ == "__main__":
    main()
