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
    scores = []

    with open(filename, "r") as file:
        for line in file:
            # remove the newline at the end of the line
            line = line.strip()
            mid = len(line) // 2
            part1 = line[:mid]
            part2 = line[mid:]
            letters = {}

            # Check letter presence on both sides
            for i in range(mid):
                if letters.get(part1[i]) == None:
                    letters[part1[i]] = 0
                if letters.get(part2[i]) == None:
                    letters[part2[i]] = 0

                letters[part1[i]] |= 1
                letters[part2[i]] |= 2

            # Now we find the letters with value 2 and add them to the score
            # Loop over the keys of the letters dictionary
            for key in letters:
                if letters[key] == 3:
                    score = calculate_value(key)
                    scores.append(score)

    return scores

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
    scores = process_file(file_tools.get_input_filename(__file__))
    sum1 = reduce(lambda x, y: x + y, scores)
    print("Part one:", sum1)

    scores2 = process_file2(file_tools.get_input_filename(__file__))
    sum2 = reduce(lambda x, y: x + y, scores2)
    print("Part two:", sum2)

if __name__ == "__main__":
    main()
