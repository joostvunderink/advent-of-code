import file_tools
import os
from functools import reduce

def read_file(filename):
    with open(filename, "r") as file:
        data = file.read()

    data = data.strip()
    
    return data.split("\n")

def get_duration(op):
    if op == "noop":
        return 1
    if op == "addx":
        return 2
    

def process_file(ops, interval, offset):
    ret = []
    reg = 1
    cycle = 0
    current_op = None
    current_op_args = None
    current_op_cycles = 0
    opline = None

    while True:
        if len(ops) == 0:
            break

        # file_tools.debug("cycle start")
        # Start of cycle
        if current_op is None:
            opline = ops.pop(0)
            if opline == "noop":
                current_op = "noop"
                current_op_args = None
            else:
                (current_op, current_op_args) = opline.split(" ")
            # file_tools.debug("new op:", current_op)
            current_op_cycles = 0
    
        cycle += 1
        current_op_cycles += 1

        # During cycle
        if cycle % interval == offset:
            file_tools.debug(cycle, reg)
            ret.append(cycle * reg)

        # End of cycle
        # file_tools.debug(current_op_cycles, get_duration(current_op))
        if current_op_cycles == get_duration(current_op):
            if current_op == "addx":
                # file_tools.debug("add", cycle, current_op_args)
                reg += int(current_op_args)
            current_op = None

    return ret

def main():
    if 'UNITTEST' in os.environ:
        return test()
    
    data = read_file(file_tools.get_input_filename(__file__))
    signals = process_file(data, 40, 20)
    print(signals)
    sum = reduce(lambda x, y: x + y, signals)

    print("Part one: ", sum)

    # (visited, num_visited) = process_file(data, 10)
    # print(num_visited)
    # print("Part two: ", num_visited)
    
def test():
    print("Running tests")


    print("All tests successful")


if __name__ == "__main__":
    main()
