import file_tools
import itertools
from functools import reduce

def calculate_value(letter):
    # 'a' is 1, 'b' is 2, etc.
    if letter >= 'a' and letter <= 'z':
        return ord(letter) - ord('a') + 1
    # 'A' is 27, 'B' is 28, etc.
    if letter >= 'A' and letter <= 'Z':
        return ord(letter) - ord('A') + 27

def process_file(filename):
    num_fully_contains = 0
    num_any_overlap = 0

    with open(filename, "r") as file:
        for line in file:
            [first, second] = line.split(",")
            [left1, right1] = first.split("-")
            [left2, right2] = second.split("-")

            # Check if the first range fully contains the second range
            if int(left1) <= int(left2) and int(right1) >= int(right2):
                num_fully_contains += 1
            elif int(left2) <= int(left1) and int(right2) >= int(right1):
                num_fully_contains += 1

            # Check if the first range has any overlap with the second range
            if int(left1) <= int(right2) and int(right1) >= int(left2):
                num_any_overlap += 1

    return (num_fully_contains, num_any_overlap)

def process_file2(filename):
    scores = []

    with open(filename, "r") as file:
        while True:
            # get the next 3 lines
            lines = [line.strip() for line in itertools.islice(file, 3)]
            # if there are fewer than 3 lines, we're done
            if len(lines) < 3:
                break

            letters = {}

            # Check letter presence in all 3 lines
            for i in range(3):
                line = lines[i]
                for j in range(len(line)):
                    letter = line[j]
                    # print(i, j, line)
                    if letters.get(letter) == None:
                        letters[letter] = 0

                    letters[letter] |= (1 << i)

            # Now we find the letters with value 2 and add them to the score
            # Loop over the keys of the letters dictionary
            for key in letters:
                if letters[key] == 7:
                    score = calculate_value(key)
                    scores.append(score)

    return scores

def main():
    (num_fully_contains, num_any_overlap) = process_file(file_tools.get_input_filename(__file__))
    print("Part one:", num_fully_contains)
    print("Part two:", num_any_overlap)

if __name__ == "__main__":
    main()
