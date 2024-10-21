import os

def get_input_filename(script_filename):
    # if env var TEST is set, return the test input filename
    if "TEST" in os.environ:
        return script_filename[0:-2] + "test.txt"

    return script_filename[0:-2] + "input.txt"

def debug(*args):
    if "DEBUG" in os.environ:
        print(*args)