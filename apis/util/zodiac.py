

# 데이터 출처 : http://sajuplus.tistory.com/121
def chemistry(zodiac1, zodiac2):
    if zodiac1 == '쥐':
        if zodiac2 == '원숭이' or zodiac2 == '용' or zodiac2 == '소':
            return 100
        elif zodiac2 == '양':
            return 50
        elif zodiac2 == '말':
            return 25
        elif zodiac2 == '개':
            return 0
        else:
            return 75
    elif zodiac1 == '소':
        if zodiac2 == '뱀' or zodiac2 == '닭' or zodiac2 == '쥐':
            return 100
        elif zodiac2 == '말':
            return 50
        elif zodiac2 == '양':
            return 25
        elif zodiac2 == '돼지' or zodiac2 == '호랑이':
            return 0
        else:
            return 75
    elif zodiac1 == '호랑이':
        if zodiac2 == '말' or zodiac2 == '개' or zodiac2 == '돼지':
            return 100
        elif zodiac2 == '닭':
            return 50
        elif zodiac2 == '소':
            return 25
        elif zodiac2 == '용' or zodiac2 == '양' or zodiac2 == '원숭이':
            return 0
        else:
            return 75
    elif zodiac1 == '토끼':
        if zodiac2 == '돼지' or zodiac2 == '양' or zodiac2 == '개':
            return 100
        elif zodiac2 == '원숭이':
            return 50
        elif zodiac2 == '닭':
            return 25
        elif zodiac2 == '소' or zodiac2 == '용':
            return 0
        else:
            return 75
    elif zodiac1 == '용':
        if zodiac2 == '원숭이' or zodiac2 == '쥐' or zodiac2 == '닭':
            return 100
        elif zodiac2 == '돼지':
            return 50
        elif zodiac2 == '개':
            return 25
        elif zodiac2 == '호랑이' or zodiac2 == '토끼':
            return 0
        else:
            return 75
    elif zodiac1 == '뱀':
        if zodiac2 == '닭' or zodiac2 == '소' or zodiac2 == '원숭이':
            return 100
        elif zodiac2 == '개':
            return 50
        elif zodiac2 == '돼지':
            return 25
        elif zodiac2 == '쥐':
            return 0
        else:
            return 75
    elif zodiac1 == '말':
        if zodiac2 == '호랑이' or zodiac2 == '개' or zodiac2 == '양':
            return 100
        elif zodiac2 == '소':
            return 50
        elif zodiac2 == '쥐':
            return 25
        elif zodiac2 == '원숭이' or zodiac2 == '':
            return 0
        else:
            return 75
    elif zodiac1 == '양':
        if zodiac2 == '돼지' or zodiac2 == '토끼' or zodiac2 == '말':
            return 100
        elif zodiac2 == '쥐':
            return 50
        elif zodiac2 == '소':
            return 25
        elif zodiac2 == '호랑이':
            return 0
        else:
            return 75
    elif zodiac1 == '원숭이':
        if zodiac2 == '쥐' or zodiac2 == '용':
            return 100
        elif zodiac2 == '토끼':
            return 50
        elif zodiac2 == '호랑이':
            return 25
        elif zodiac2 == '말':
            return 0
        else:
            return 75
    elif zodiac1 == '닭':
        if zodiac2 == '뱀' or zodiac2 == '소' or zodiac2 == '용':
            return 100
        elif zodiac2 == '호랑이':
            return 50
        elif zodiac2 == '토끼':
            return 25
        elif zodiac2 == '말':
            return 0
        else:
            return 75
    elif zodiac1 == '개':
        if zodiac2 == '말' or zodiac2 == '호랑이' or zodiac2 == '토끼':
            return 100
        elif zodiac2 == '뱀':
            return 50
        elif zodiac2 == '용':
            return 25
        elif zodiac2 == '쥐':
            return 0
        else:
            return 75
    elif zodiac1 == '돼지':
        if zodiac2 == '토끼' or zodiac2 == '양' or zodiac2 == '호랑이':
            return 100
        elif zodiac2 == '용':
            return 50
        elif zodiac2 == '뱀':
            return 25
        elif zodiac2 == '소':
            return 0
        else:
            return 75
