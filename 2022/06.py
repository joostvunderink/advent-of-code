import file_tools
import itertools
from functools import reduce

def are_all_different_chars(s):
    print(s)
    return len(s) == len(set(s))

def process_file(filename):
    with open(filename, "r") as file:
        data = file.read()
        pos = 0
        l = 4

        while pos + l < len(data):
            if are_all_different_chars(data[pos:pos + l]):
                break
            pos += 1

    return pos

def process_file2(filename):
    with open(filename, "r") as file:
        data = file.read()
        pos = 0
        l = 14

        while pos + l < len(data):
            if are_all_different_chars(data[pos:pos + l]):
                break
            pos += 1

    return pos

def get_result_1(stacks):
    # Return a string combining the last elements of each stack
    return "".join([stack[-1] for stack in stacks])

def main():
    pos1 = process_file(file_tools.get_input_filename(__file__))
    pos2 = process_file2(file_tools.get_input_filename(__file__))
    print("Part one:", pos1 + 4)
    print("Part two:", pos2 + 14)

if __name__ == "__main__":
    main()
