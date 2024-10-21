import file_tools
import os

def read_file(filename):
    with open(filename, "r") as file:
        data = file.read()

    data = data.strip()
    
    return data.split("\n")

def add_to_visited(visited, pos):
    (x, y) = pos
    if not visited.get(x):
        visited[x] = {}
    
    if not visited[x].get(y):
        visited[x][y] = True
        return True

    return False

def get_new_head_pos(head_pos, direction):
    if direction == 'R':
        return (head_pos[0] + 1, head_pos[1])
    if direction == 'L':
        return (head_pos[0] - 1, head_pos[1])
    if direction == 'U':
        return (head_pos[0], head_pos[1] + 1)
    if direction == 'D':
        return (head_pos[0], head_pos[1] - 1)
    
    return head_pos

def get_new_tail_pos(head_pos, tail_pos):
    # Head and tail are on the same spot
    if head_pos[0] == tail_pos[0] and head_pos[1] == tail_pos[1]:
        return tail_pos
    
    (x, y) = tail_pos

    # Same row (same y)
    if head_pos[1] == tail_pos[1]:
        if abs(head_pos[0] - tail_pos[0]) == 2:
            # gap of 1, move one step closer
            # x should be the average of head x and tail x
            x = int((head_pos[0] + tail_pos[0]) / 2)
        
    # Same column (same x)
    elif head_pos[0] == tail_pos[0]:
        if abs(head_pos[1] - tail_pos[1]) == 2:
            # gap of 1, move one step closer
            # y should be the average of head y and tail y
            y = int((head_pos[1] + tail_pos[1]) / 2)

    # double diagonal distance
    # This wasn't possible in the case with only 2 knots
    elif abs(head_pos[0] - tail_pos[0]) == 2 and abs(head_pos[1] - tail_pos[1]) == 2:
        x = int((head_pos[0] + tail_pos[0]) / 2)
        y = int((head_pos[1] + tail_pos[1]) / 2)

    # chess horse
    elif abs(head_pos[0] - tail_pos[0]) == 2:
        x = int((head_pos[0] + tail_pos[0]) / 2)
        y = head_pos[1]

    elif abs(head_pos[1] - tail_pos[1]) == 2:
        x = head_pos[0]
        y = int((head_pos[1] + tail_pos[1]) / 2)

    return (x, y)


def process_file(moves, rope_len):
    visited = {}
    num_visited = 1
    add_to_visited(visited, (0,0))

    rope = [(0, 0) for _ in range(rope_len)]

    for line in moves:
        (direction, steps) = line.split(" ")
        print(steps, direction)
        for i in range(int(steps)):
            # move the head according to the direction
            rope[0] = get_new_head_pos(rope[0], direction)
            # move the rest of the rope, 1 by 1
            for i in range(1, len(rope)):
                rope[i] = get_new_tail_pos(rope[i-1], rope[i])

            new_coord_visited = add_to_visited(visited, rope[-1])
            if new_coord_visited:
                num_visited += 1
            print(direction, rope)


    return (visited, num_visited)


def main():
    if 'UNITTEST' in os.environ:
        return test()
    data = read_file(file_tools.get_input_filename(__file__))
    (visited, num_visited) = process_file(data, 2)
    print(num_visited)

    print("Part one: ", num_visited)

    (visited, num_visited) = process_file(data, 10)
    print(num_visited)
    print("Part two: ", num_visited)
    
def test():
    print("Running tests")

    # touches: h = t
    assert(get_new_tail_pos((3, 5),(3, 5)) == (3, 5))

    # touches: horizontally/vertically
    assert(get_new_tail_pos((3, 5),(3, 6)) == (3, 6))
    assert(get_new_tail_pos((-3, 5),(-4, 5)) == (-4, 5))

    # touches: diagonally
    assert(get_new_tail_pos((3, 5),(4, 6)) == (4, 6))

    # same x
    assert(get_new_tail_pos((3, 5),(3, 7)) == (3, 6))

    # same y
    assert(get_new_tail_pos((-3, 5),(-5, 5)) == (-4, 5))

    # diagonal move
    assert(get_new_tail_pos((3, 5),(4, 7)) == (3, 6))
    assert(get_new_tail_pos((3, 5),(4, 3)) == (3, 4))

    assert(get_new_tail_pos((3, 5),(1, 4)) == (2, 5))
    assert(get_new_tail_pos((3, 5),(5, 4)) == (4, 5))

    # double diagonal move
    assert(get_new_tail_pos((3, 5),(5, 7)) == (4, 6))

    print("All tests successful")


if __name__ == "__main__":
    main()
