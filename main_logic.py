from data_230924 import *
import sys
import json
import codecs

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)
input_string = sys.argv[1]
# input_string = "휴학 중인데 복학신청하고 싶어 그리고 버스 시간표 알려줘"

nouns_list = []
code_list = []

for __ in range (len(input_string)):
    temp = ""
    for word_string in exist_word:
        if input_string.startswith(word_string):
            if len(temp) < len(word_string):
                temp = word_string
    if temp != "":
        nouns_list.append(exist_word[temp])
        input_string = input_string[len(temp) - 1:]
    input_string = input_string[1:]

for index_number in range(len(nouns_list)):
    combine_string = ""
    times = index_number
    while times < len(nouns_list):
        temp_string = combine_string
        combine_string += nouns_list[times]
        times += 1
        if combine_string in exist_code :
            if code_list and code_list[-1] in temp_string and temp_string in combine_string: # 요소 중복에 따른 (과거, 현재)
                code_list.pop(-1)
            if code_list and nouns_list[index_number] in code_list[-1]: # 요소 중복에 따른 (현재, 미래)
                continue
            code_list.append(exist_code[combine_string])
            
if code_list:
    last_element = code_list[-1]
else:
    last_element = "404 NOT FOUND"

print(json.dumps({"last_element": last_element}, ensure_ascii=False))