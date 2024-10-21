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
        "A Y": 6,
        "A Z": 0,

        "B X": 0,
        "B Y": 3,
        "B Z": 6,

        "C X": 6,
        "C Y": 0,
        "C Z": 3,
    }
    return results[round]

def calculate_bonus(round):
    my_choice = round[-1]
    values = {
        "X": 1, # Rock
        "Y": 2, # Paper
        "Z": 3, # Scissors
    }
    return values[my_choice]

def calculate_result_2(round):
    # X means: lose
    # Y means: draw
    # Z means: win
    results = {
        "A X": 0 + 3, # Rock Scissors
        "A Y": 3 + 1, # Rock Rock
        "A Z": 6 + 2, # Rock Paper

        "B X": 0 + 1, # Paper Rock
        "B Y": 3 + 2, # Paper Paper
        "B Z": 6 + 3, # Paper Scissors

        "C X": 0 + 2, # Scissors Paper
        "C Y": 3 + 3, # Scissors Scissors
        "C Z": 6 + 1, # Scissors Rock
    }
    return results[round]


def process_file(filename):
    score1 = 0
    score2 = 0

    with open(filename, "r") as file:
        for line in file:
            score1 += calculate_result(line.strip()) + calculate_bonus(line.strip())
            score2 += calculate_result_2(line.strip())

    return score1, score2

def main():
    score1, score2 = process_file(file_tools.get_input_filename(__file__))
    print("Part one:", score1)
    print("Part two:", score2)

if __name__ == "__main__":
    main()
