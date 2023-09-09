from data_dictionary import *
# import 없이 쓸거면 params(dictionary)와 exist_code(set) 자료형을 상단에 작성하면 됩니다.
# from konlpy.tag import Okt
# 자연어 처리 모델
import sys
# 외부에서 python 코드를 다루기 위함
import json
# json 자료형으로 codecs를 통해 export 해주기 위함
import codecs
# 외부로 export 해주기 위함
import MeCab

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)
# sysout 을 할 버퍼를 utf-8 한글인코딩으로 설정

input_string = sys.argv[1]
# main_logic.js 상에서 python 코드 호출 시 첫번째 인자를 받아올 거임

# 테스트용 input_string 을 sys 의 인자로서 받아오는 것이 아닌 자체적인 테스트를 작성할 때 쓰려는 것

# Mecab 테거 초기화
m = MeCab.Tagger()

# 입력 텍스트를 형태소 분석
a = m.parse(input_string)

# 파싱 결과를 줄 단위로 나누어서 처리
lines = a.split('\n')
nouns_list = []

# 각 줄에서 명사 형태소(NNG)만 추출
for line in lines:
    if '\t' in line:
        parts = line.split('\t')
        morphemes = parts[1].split(',')
        if morphemes[0] == 'NNG':  # 명사 형태소(NNG)인 경우
            nouns_list.append(parts[0])  # 명사를 추출하여 리스트에 추가
        if morphemes[0] == 'NNP':  # 명사 형태소(NNG)인 경우
            nouns_list.append(parts[0])  # 명사를 추출하여 리스트에 추가

# okt = Okt()
# 한국어 자연어처리 모델 선언, 이 외 꼬꼬마 등의 모듈이 있음


# nouns_list = okt.nouns(input_string)
# Okt 모듈을 사용하여 명사단위로 쪼갤 것임

code_list = []
# nouns_list를 data_dictionary 의 params를 참고하여 code로 변환, code_list에 저장
view_list = []
# code_list 에서 data_dictionary의 exist_code를 참고하여 존재하는 code만을 list에 저장시킴
temp_variable_key = ""

# 접두사 코드를 다루기 위해 임시키 개념 도입
# 접두사가 검출되었을 시 해당 접두사를 임시키로 저장
# 해당 접두사가 검출되었을 때 임시키에 저장,
# 접두사가 존재한다면 이후 메인코드에 도달하였을 때, 접두사 코드가 존재하는 지 확인함.
# ex) M접두사 인식, temp_variable_key = "M접두사" 저장, M메인 도달 시, temp_variable_key가 존재하면
# {temp_variable_key} + {current_code} 즉, "M접두사" + "M메인" 을 시행함.
# 이하 if current_code.startswith('F'): 와 if current_code.startswith('M'): 부분 참고

for word in nouns_list:
# nouns_list를 data_dictionary 의 params를 참고하여 code로 변환, code_list에 저장
    result = input_string.find(word)
    # word 가 몇번째 자리에 있는지 알려줌, 만약 존재하지 않는다면 -1 을 반환함
    # print(result) 테스트용, 주석풀면 작동 안합니다
    if result != -1:
        # input_string에 현재 순회중인 word 가 존재한다면 이하 명령문을 실행하라
        try :
            value_code = params[word]
        except :

            print(json.dumps({"last_element": "404 NOT FOUND"}, ensure_ascii=False))
            exit()

        # dictionary 의 key인 word 에 해당하는 value가 존재한다면 value_code 로서 저장하라
        # print(value_code) 테스트용, 주석풀면 작동 안합니다
        code_list.append(value_code)
        # value_code를 code_list에 추가하여라, value_code 변수에 저장하지 않고 그냥 실행해도 되는데 그냥 나눴음
    # print(code_list) 테스트용, 주석풀면 작동 안합니다

for current_code in code_list:
# code_list 에서 data_dictionary의 exist_code를 참고하여 존재하는 code만을 list에 저장시킴
    if current_code.startswith('B') and view_list:
        before_view = view_list[-1]
        view_list.pop()
        # 마지막 요소 제거
        found_key = None
        for key, value in params.items():
            if value == before_view:
                found_key = key
                break
        if f"{params.get(found_key)}{current_code}" in exist_code:
            question_string = f"{params.get(found_key)}{current_code}"
        else:
            question_string = f"{params[found_key]}"
        view_list.append(question_string)

    if current_code.startswith('F'):
        # 접두사 코드가 인식되면 temp_variable_key를 부여함
        temp_variable_key = current_code

    if current_code.startswith('M'):
        if temp_variable_key == "":
            # temp_variable_key 가 존재하지 않는다면
            # startswith('F') 에서 temp_variable_key의 값 부여 여부를 판단함
            question_string = f"{current_code}"
            view_list.append(question_string)
        if temp_variable_key != "":
            # temp_variable_key 가 존재한다면
            if f"{temp_variable_key}{current_code}" in exist_code:
                question_string = f"{temp_variable_key}{current_code}"
            else:
                question_string = f"{current_code}"
            view_list.append(question_string)
            temp_variable_key = ""


if view_list: # view_list(의 요소)가 존재한다면
    last_element = view_list[-1]
    # view_list의 마지막 요소를 last_element로 반환하라
else: # view_list(의 요소)가 존재하지 않는다면
    last_element = "404 NOT FOUND"
    # last_element가 존재하지 않다고 경고문을 보내라
    # 원하는 임의 값으로 수정해도 무방함

# print(view_list) #
# 테스트용, 주석풀면 작동 안합니다
# print(last_element)
# 테스트용, 주석풀면 작동 안합니다

# 결과를 JSON 형식으로 출력
print(json.dumps({"last_element": last_element}, ensure_ascii=False))

# last_element = {"last_element": last_element}
# print(json.dumps(last_element, ensure_ascii=False))
# 테스트용, 주석풀면 작동 안합니다