# appends a .js extension to all the import/export statements

import os

def get_filtered(path):
    allFiles = os.listdir(path)
    return list(filter(lambda filename: ".d.ts" not in filename and ".py" not in filename, allFiles))

def format_js(path):
    file_in = open(path, "r")
    
    source = "".join(file_in.readlines())

    last = 0
    while True:
        index = source.find(" from \'", last)
        if index == -1:
            break

        first_quote_index = source.find("\'", index + 1)
        second_quote_index = source.find("\'", first_quote_index + 1)

        if source[second_quote_index - 3 : second_quote_index] != ".js":
            source = source[:second_quote_index] + ".js" + source[second_quote_index:]
        
        last = second_quote_index + 1


    file_in.close()

    print(path)
    with open(path, "w") as file_out:
        file_out.write(source)

def format_all(path):
    file_list = get_filtered(path)

    for file in file_list:
        if ".js" in file:
            format_js(path + "/" + file)
        else:
            format_all(path + "/" + file)

format_all(".")
# format_js("./test.js")