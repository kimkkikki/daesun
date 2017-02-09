import re


# 유니코드 한글 시작 : 44032, 끝 : 55199
base_code, chosung, jungsung = 44032, 588, 28

# 초성 리스트. 00 ~ 18
chosungs = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
chosung_scores = {'ㄱ': 2, 'ㄲ': 4, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 6, 'ㄹ': 5, 'ㅁ': 4, 'ㅂ': 4, 'ㅃ': 8, 'ㅅ': 2, 'ㅆ': 4, 'ㅇ': 1,
                  'ㅈ': 3,
                  'ㅉ': 5, 'ㅊ': 4, 'ㅋ': 3, 'ㅌ': 4, 'ㅍ': 4, 'ㅎ': 3}
# 중성 리스트. 00 ~ 20
jungsungs = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
jungsung_score = {'ㅏ': 2, 'ㅐ': 3, 'ㅑ': 3, 'ㅒ': 4, 'ㅓ': 2, 'ㅔ': 3, 'ㅕ': 3, 'ㅖ': 4, 'ㅗ': 2, 'ㅘ': 4, 'ㅙ': 5, 'ㅚ': 3,
                  'ㅛ': 3,
                  'ㅜ': 2, 'ㅝ': 4, 'ㅞ': 5, 'ㅟ': 3, 'ㅠ': 3, 'ㅡ': 1, 'ㅢ': 2, 'ㅣ': 1}

# 종성 리스트. 00 ~ 27 + 1(1개 없음)
jongsungs = [' ', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
             'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
jongsung_score = {' ': 0, 'ㄱ': 2, 'ㄲ': 4, 'ㄳ': 4, 'ㄴ': 2, 'ㄵ': 5, 'ㄶ': 5, 'ㄷ': 3, 'ㄹ': 5, 'ㄺ': 7, 'ㄻ': 9, 'ㄼ': 9,
                  'ㄽ': 7,
                  'ㄾ': 9, 'ㄿ': 9, 'ㅀ': 8, 'ㅁ': 4, 'ㅂ': 4, 'ㅄ': 6, 'ㅅ': 2, 'ㅆ': 4, 'ㅇ': 1, 'ㅈ': 3, 'ㅊ': 4, 'ㅋ': 3,
                  'ㅌ': 4,
                  'ㅍ': 4, 'ㅎ': 3}


def split_korean(name):
    split_keyword_list = list(name)

    result = []
    for keyword in split_keyword_list:
        # 한글 여부 check 후 분리
        if re.match('.*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*', keyword) is not None:
            score = 0

            char_code = ord(keyword) - base_code

            char1 = int(char_code / chosung)
            score += chosung_scores.get(chosungs[char1])

            char2 = int((char_code - (chosung * char1)) / jungsung)
            score += jungsung_score.get(jungsungs[char2])

            char3 = int((char_code - (chosung * char1) - (jungsung * char2)))
            score += jongsung_score.get(jongsungs[char3])

            score %= 10

            result.append(score)
        else:
            result.append(keyword)

    return result


def name_chemistry(name1, name2):
    name1_split = split_korean(name1)
    name2_split = split_korean(name2)

    length = len(name1_split)
    if length < len(name2_split):
        length = len(name2_split)

    sum_list = []
    for i in range(0, length):
        if i < len(name1_split):
            sum_list.append(name1_split[i])
        if i < len(name2_split):
            sum_list.append(name2_split[i])

    while len(sum_list) > 2:
        result_list = []
        for i, sum in enumerate(sum_list):
            if i + 1 < len(sum_list):
                result_list.append((sum_list[i] + sum_list[i+1]) % 10)
        sum_list = result_list

    score = sum_list[0] * 10 + sum_list[1]

    if score == 0:
        score = 100

    return score
