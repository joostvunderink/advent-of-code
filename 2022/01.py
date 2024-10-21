import file_tools

def process_file(filename):
    calories_per_elf = []

    with open(filename, "r") as file:
        current_calories = 0
        for line in file:
            if line == "\n":
                calories_per_elf.append(current_calories)
                current_calories = 0
            else:
                current_calories += int(line)
    
    # Return the array sorted by calories, highest first
    calories_per_elf.sort(reverse=True)
    return calories_per_elf

def main():
    calories = process_file(file_tools.get_input_filename(__file__))
    print("Part one:", calories[0])
    print("Part two:", calories[0] + calories[1] + calories[2])

if __name__ == "__main__":
    main()
