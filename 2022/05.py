import file_tools

def init_stacks(stack_lines):
    stack_nums = stack_lines[0].strip().split(" ")
    num_stacks = int(stack_nums[-1])
    stacks = [[] for _ in range(num_stacks)]

    for i in range(1, len(stack_lines)):
        for j in range(num_stacks):
            if stack_lines[i][1 + 4 * j] != " ":
                stacks[j].append(stack_lines[i][1 + 4 * j])
    return stacks

def process_move_9000(stacks, move):
    (null, num, null, source, null, target) = move.split(" ")
    for i in range(int(num)):
        stacks[int(target) - 1].append(stacks[int(source) - 1].pop())

def process_move_9001(stacks, move):
    (null, num, null, source, null, target) = move.split(" ")
    temp = []
    for i in range(int(num)):
        temp.append(stacks[int(source) - 1].pop())
    for i in range(int(num)):
        stacks[int(target) - 1].append(temp.pop())

def process_file(filename):
    stacks = []
    stack_lines = []

    with open(filename, "r") as file:
        for line in file:
            if len(stacks) == 0:
                stack_lines.append(line)
            
            if line.startswith(" 1"):
                stack_lines.reverse()
                stacks_9000 = init_stacks(stack_lines)
                stacks_9001 = init_stacks(stack_lines)

            if line.startswith("move"):
                process_move_9000(stacks_9000, line.strip())
                process_move_9001(stacks_9001, line.strip())

    return (stacks_9000, stacks_9001)

def get_result(stacks):
    return "".join([stack[-1] for stack in stacks])

def main():
    (stacks_9000, stacks_9001) = process_file(file_tools.get_input_filename(__file__))
    print("Part one:", get_result(stacks_9000))
    print("Part two:", get_result(stacks_9001))

if __name__ == "__main__":
    main()
