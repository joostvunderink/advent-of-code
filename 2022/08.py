import file_tools

def read_file(filename):
    with open(filename, "r") as file:
        data = file.read()

    data = data.strip()
    
    a = data.split("\n")
    b = [list(x) for x in a]
    # print(data)
    # print(b)
    return b

def determine_visibility(plot, width, height, x, y):
    visible_left = True
    visible_right = True
    visible_top = True
    visible_bottom = True

    treesize = plot[x][y]

    for i in range(width):
        if i < x and plot[i][y] > treesize:
            visible_left = False
        if i > x and plot[i][y] > treesize:
            visible_right = False

    for j in range(height):
        if j < y and plot[x][j] > treesize:
            visible_top = False
        if j > y and plot[x][j] > treesize:
            visible_bottom = False

    return visible_left or visible_right or visible_top or visible_bottom

def get_num_visible_trees(plot):
    width = len(plot[0])
    height = len(plot)
    visible = [[False for _ in range(width)] for _ in range(height)]

    for x in range(width):
        max = -1
        file_tools.debug("down")
        for y in range(height):
            th = int(plot[y][x])
            if th > max:
                file_tools.debug(y, x, "visible")
                visible[y][x] = True
                max = th

        file_tools.debug("up")
        max = -1
        for y in reversed(range(height)):
            th = int(plot[y][x])
            if th > max:
                file_tools.debug(y, x, "visible")
                visible[y][x] = True
                max = th

    for y in range(height):
        file_tools.debug("right")
        max = -1
        for x in range(width):
            th = int(plot[y][x])
            if th > max:
                file_tools.debug(y, x, "visible")
                visible[y][x] = True
                max = th

        file_tools.debug("left")
        max = -1
        for x in reversed(range(width)):
            th = int(plot[y][x])
            if th > max:
                file_tools.debug(y, x, "visible")
                visible[y][x] = True
                max = th

    return visible

def calculate_scenic_score(plot, x, y):
    th = plot[y][x]

    # up
    u = 0
    for i in reversed(range(y)):
        u += 1
        file_tools.debug("u", x, i, plot[i][x])
        if plot[i][x] >= th:
            break

    # down
    d = 0
    for i in range(y + 1, len(plot)):
        file_tools.debug("d", x, i, plot[i][x])
        d += 1
        if plot[i][x] >= th:
            break

    # left
    l = 0
    for i in reversed(range(x)):
        file_tools.debug("l", i, y, plot[y][i])
        l += 1
        if plot[y][i] >= th:
            break

    r = 0
    for i in range(x + 1, len(plot[0])):
        file_tools.debug("r", i, y, plot[y][i])
        r += 1
        if plot[y][i] >= th:
            break

    file_tools.debug(u, d, l, r)
    return u * d * l * r


def main():
    input = read_file(file_tools.get_input_filename(__file__))
    visible = get_num_visible_trees(input)
    num_visible = 0
    for x in range(len(visible[0])):
        for y in range(len(visible)):
            if visible[y][x]:
                num_visible += 1

    print("Part one: ", num_visible)

    max_scenic_score = 0
    for x in range(len(input[0])):
        for y in range(len(input)):
            scenic_score = calculate_scenic_score(input, x, y)
            file_tools.debug("scsc", x, y, input[y][x], scenic_score)

            max_scenic_score = max(max_scenic_score, scenic_score)

    scenic_score = calculate_scenic_score(input, 4, 3)
    print("Part two: ", max_scenic_score)
    


if __name__ == "__main__":
    main()
