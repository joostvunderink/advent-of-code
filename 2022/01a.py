import file_tools

# A = Rock
# B = Paper
# C = Scissors
# X = Rock
# Y = Paper
# Z = Scissors


def calculate_result(round):
    results = {
        "A X": 3,
        "A Y": 0,
        "A Z": 6,
        "B X": 0,
        "B Y": 3,
        "B Z": 6,
        "C X": 0,
        "C Y": 6,
        "C Z": 3,
    }
    return results[round]

def calculate_bonus(round):
    my_choice = round[-1]
    values = {
        "X": 1,
        "Y": 2,
        "Z": 3,
    }
    return values[my_choice]

def process_file(filename):
    score = 0

    with open(filename, "r") as file:
        for line in file:
            score += calculate_result(line.strip()) + calculate_bonus(line.strip())

    return score    

def main():
    score = process_file(file_tools.get_input_filename(__file__))
    print("Part one:", score)

if __name__ == "__main__":
    main()
