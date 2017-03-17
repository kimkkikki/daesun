def get_constellation(birthday):
    if (1, 20) <= birthday <= (2, 18):
        return '물병'
    elif (2, 19) <= birthday <= (3, 20):
        return '물고기'
    elif (3, 21) <= birthday <= (4, 19):
        return '양'
    elif (4, 20) <= birthday <= (5, 20):
        return '황소'
    elif (5, 21) <= birthday <= (6, 21):
        return '쌍둥이'
    elif (6, 22) <= birthday <= (7, 22):
        return '게'
    elif (7, 23) <= birthday <= (8, 22):
        return '사자'
    elif (8, 23) <= birthday <= (9, 23):
        return '처녀'
    elif (9, 24) <= birthday <= (10, 22):
        return '천칭'
    elif (10, 23) <= birthday <= (11, 22):
        return '전갈'
    elif (11, 23) <= birthday <= (12, 21):
        return '사수'
    else:
        return '염소'


def constellation_chemistry(cons):
    candidates_constellation = [{'candidate': '문재인', 'constellation': '물병'},
                                {'candidate': '안희정', 'constellation': '황소'},
                                {'candidate': '이재명', 'constellation': '물병'},
                                {'candidate': '심상정', 'constellation': '물고기'},
                                {'candidate': '유승민', 'constellation': '염소'},
                                {'candidate': '남경필', 'constellation': '물병'},
                                {'candidate': '안철수', 'constellation': '물고기'}]

    for candidate in candidates_constellation:
        score = constellation_chemistry_man_to_woman(cons, candidate.get('constellation')) + \
                constellation_chemistry_man_to_woman(candidate.get('constellation'), cons) + \
                constellation_chemistry_woman_to_man(cons, candidate.get('constellation')) + \
                constellation_chemistry_woman_to_man(candidate.get('constellation'), cons)
        candidate['score'] = score

    return candidates_constellation



def constellation_chemistry_man_to_woman(cons1, cons2):
    if cons1 == '양':
        if cons2 == '양':
            return 87.5
        elif cons2 == '황소':
            return 25
        elif cons2 == '쌍둥이':
            return 62.5
        elif cons2 == '게':
            return 75
        elif cons2 == '사자':
            return 87.5
        elif cons2 == '처녀':
            return 37.5
        elif cons2 == '천칭':
            return 62.5
        elif cons2 == '전갈':
            return 12.5
        elif cons2 == '사수':
            return 100
        elif cons2 == '염소':
            return 75
        elif cons2 == '물병':
            return 50
        elif cons2 == '물고기':
            return 25
    elif cons1 == '황소':
        if cons2 == '양':
            return 75
        elif cons2 == '황소':
            return 87.5
        elif cons2 == '쌍둥이':
            return 12.5
        elif cons2 == '게':
            return 50
        elif cons2 == '사자':
            return 37.5
        elif cons2 == '처녀':
            return 87.5
        elif cons2 == '천칭':
            return 25
        elif cons2 == '전갈':
            return 25
        elif cons2 == '사수':
            return 12.5
        elif cons2 == '염소':
            return 100
        elif cons2 == '물병':
            return 12.5
        elif cons2 == '물고기':
            return 62.5
    elif cons1 == '쌍둥이':
        if cons2 == '양':
            return 50
        elif cons2 == '황소':
            return 12.5
        elif cons2 == '쌍둥이':
            return 87.5
        elif cons2 == '게':
            return 12.5
        elif cons2 == '사자':
            return 50
        elif cons2 == '처녀':
            return 25
        elif cons2 == '천칭':
            return 100
        elif cons2 == '전갈':
            return 37.5
        elif cons2 == '사수':
            return 62.5
        elif cons2 == '염소':
            return 75
        elif cons2 == '물병':
            return 100
        elif cons2 == '물고기':
            return 12.5
    elif cons1 == '게':
        if cons2 == '양':
            return 25
        elif cons2 == '황소':
            return 50
        elif cons2 == '쌍둥이':
            return 75
        elif cons2 == '게':
            return 87.5
        elif cons2 == '사자':
            return 25
        elif cons2 == '처녀':
            return 50
        elif cons2 == '천칭':
            return 37.5
        elif cons2 == '전갈':
            return 100
        elif cons2 == '사수':
            return 12.5
        elif cons2 == '염소':
            return 62.5
        elif cons2 == '물병':
            return 12.5
        elif cons2 == '물고기':
            return 100
    elif cons1 == '사자':
        if cons2 == '양':
            return 87.5
        elif cons2 == '황소':
            return 25
        elif cons2 == '쌍둥이':
            return 62.5
        elif cons2 == '게':
            return 12.5
        elif cons2 == '사자':
            return 100
        elif cons2 == '처녀':
            return 37.5
        elif cons2 == '천칭':
            return 62.5
        elif cons2 == '전갈':
            return 37.5
        elif cons2 == '사수':
            return 87.5
        elif cons2 == '염소':
            return 75
        elif cons2 == '물병':
            return 25
        elif cons2 == '물고기':
            return 12.5
    elif cons1 == '처녀':
        if cons2 == '양':
            return 50
        elif cons2 == '황소':
            return 100
        elif cons2 == '쌍둥이':
            return 75
        elif cons2 == '게':
            return 62.5
        elif cons2 == '사자':
            return 37.5
        elif cons2 == '처녀':
            return 87.5
        elif cons2 == '천칭':
            return 37.5
        elif cons2 == '전갈':
            return 50
        elif cons2 == '사수':
            return 25
        elif cons2 == '염소':
            return 100
        elif cons2 == '물병':
            return 12.5
        elif cons2 == '물고기':
            return 62.5
    elif cons1 == '천칭':
        if cons2 == '양':
            return 50
        elif cons2 == '황소':
            return 37.5
        elif cons2 == '쌍둥이':
            return 100
        elif cons2 == '게':
            return 25
        elif cons2 == '사자':
            return 50
        elif cons2 == '처녀':
            return 75
        elif cons2 == '천칭':
            return 100
        elif cons2 == '전갈':
            return 25
        elif cons2 == '사수':
            return 62.5
        elif cons2 == '염소':
            return 75
        elif cons2 == '물병':
            return 87.5
        elif cons2 == '물고기':
            return 37.5
    elif cons1 == '전갈':
        if cons2 == '양':
            return 25
        elif cons2 == '황소':
            return 62.5
        elif cons2 == '쌍둥이':
            return 37.5
        elif cons2 == '게':
            return 87.5
        elif cons2 == '사자':
            return 75
        elif cons2 == '처녀':
            return 62.5
        elif cons2 == '천칭':
            return 75
        elif cons2 == '전갈':
            return 87.5
        elif cons2 == '사수':
            return 12.5
        elif cons2 == '염소':
            return 62.5
        elif cons2 == '물병':
            return 37.5
        elif cons2 == '물고기':
            return 100
    elif cons1 == '사수':
        if cons2 == '양':
            return 87.5
        elif cons2 == '황소':
            return 75
        elif cons2 == '쌍둥이':
            return 62.5
        elif cons2 == '게':
            return 12.5
        elif cons2 == '사자':
            return 100
        elif cons2 == '처녀':
            return 37.5
        elif cons2 == '천칭':
            return 62.5
        elif cons2 == '전갈':
            return 12.5
        elif cons2 == '사수':
            return 87.5
        elif cons2 == '염소':
            return 75
        elif cons2 == '물병':
            return 50
        elif cons2 == '물고기':
            return 25
    elif cons1 == '염소':
        if cons2 == '양':
            return 37.5
        elif cons2 == '황소':
            return 100
        elif cons2 == '쌍둥이':
            return 25
        elif cons2 == '게':
            return 62.5
        elif cons2 == '사자':
            return 50
        elif cons2 == '처녀':
            return 100
        elif cons2 == '천칭':
            return 25
        elif cons2 == '전갈':
            return 50
        elif cons2 == '사수':
            return 75
        elif cons2 == '염소':
            return 87.5
        elif cons2 == '물병':
            return 37.5
        elif cons2 == '물고기':
            return 62.5
    elif cons1 == '물병':
        if cons2 == '양':
            return 50
        elif cons2 == '황소':
            return 75
        elif cons2 == '쌍둥이':
            return 100
        elif cons2 == '게':
            return 12.5
        elif cons2 == '사자':
            return 50
        elif cons2 == '처녀':
            return 37.5
        elif cons2 == '천칭':
            return 87.5
        elif cons2 == '전갈':
            return 75
        elif cons2 == '사수':
            return 62.5
        elif cons2 == '염소':
            return 25
        elif cons2 == '물병':
            return 100
        elif cons2 == '물고기':
            return 12.5
    elif cons1 == '물고기':
        if cons2 == '양':
            return 75
        elif cons2 == '황소':
            return 50
        elif cons2 == '쌍둥이':
            return 75
        elif cons2 == '게':
            return 100
        elif cons2 == '사자':
            return 50
        elif cons2 == '처녀':
            return 25
        elif cons2 == '천칭':
            return 37.5
        elif cons2 == '전갈':
            return 87.5
        elif cons2 == '사수':
            return 37.5
        elif cons2 == '염소':
            return 50
        elif cons2 == '물병':
            return 12.5
        elif cons2 == '물고기':
            return 87.5


def constellation_chemistry_woman_to_man(cons1, cons2):
    if cons1 == '양':
        if cons2 == '양':
            return 87.5
        elif cons2 == '황소':
            return 75
        elif cons2 == '쌍둥이':
            return 50
        elif cons2 == '게':
            return 25
        elif cons2 == '사자':
            return 87.5
        elif cons2 == '처녀':
            return 50
        elif cons2 == '천칭':
            return 50
        elif cons2 == '전갈':
            return 25
        elif cons2 == '사수':
            return 87.5
        elif cons2 == '염소':
            return 37.5
        elif cons2 == '물병':
            return 50
        elif cons2 == '물고기':
            return 75
    elif cons1 == '황소':
        if cons2 == '양':
            return 25
        elif cons2 == '황소':
            return 87.5
        elif cons2 == '쌍둥이':
            return 12.5
        elif cons2 == '게':
            return 50
        elif cons2 == '사자':
            return 25
        elif cons2 == '처녀':
            return 100
        elif cons2 == '천칭':
            return 37.5
        elif cons2 == '전갈':
            return 62.5
        elif cons2 == '사수':
            return 75
        elif cons2 == '염소':
            return 100
        elif cons2 == '물병':
            return 75
        elif cons2 == '물고기':
            return 50
    elif cons1 == '쌍둥이':
        if cons2 == '양':
            return 62.5
        elif cons2 == '황소':
            return 12.5
        elif cons2 == '쌍둥이':
            return 87.5
        elif cons2 == '게':
            return 75
        elif cons2 == '사자':
            return 62.5
        elif cons2 == '처녀':
            return 75
        elif cons2 == '천칭':
            return 100
        elif cons2 == '전갈':
            return 37.5
        elif cons2 == '사수':
            return 62.5
        elif cons2 == '염소':
            return 25
        elif cons2 == '물병':
            return 100
        elif cons2 == '물고기':
            return 75
    elif cons1 == '게':
        if cons2 == '양':
            return 75
        elif cons2 == '황소':
            return 50
        elif cons2 == '쌍둥이':
            return 12.5
        elif cons2 == '게':
            return 87.5
        elif cons2 == '사자':
            return 12.5
        elif cons2 == '처녀':
            return 62.5
        elif cons2 == '천칭':
            return 25
        elif cons2 == '전갈':
            return 87.5
        elif cons2 == '사수':
            return 12.5
        elif cons2 == '염소':
            return 62.5
        elif cons2 == '물병':
            return 12.5
        elif cons2 == '물고기':
            return 100
    elif cons1 == '사자':
        if cons2 == '양':
            return 87.5
        elif cons2 == '황소':
            return 37.5
        elif cons2 == '쌍둥이':
            return 50
        elif cons2 == '게':
            return 25
        elif cons2 == '사자':
            return 100
        elif cons2 == '처녀':
            return 37.5
        elif cons2 == '천칭':
            return 50
        elif cons2 == '전갈':
            return 75
        elif cons2 == '사수':
            return 100
        elif cons2 == '염소':
            return 50
        elif cons2 == '물병':
            return 50
        elif cons2 == '물고기':
            return 50
    elif cons1 == '처녀':
        if cons2 == '양':
            return 37.5
        elif cons2 == '황소':
            return 87.5
        elif cons2 == '쌍둥이':
            return 25
        elif cons2 == '게':
            return 50
        elif cons2 == '사자':
            return 37.5
        elif cons2 == '처녀':
            return 87.5
        elif cons2 == '천칭':
            return 75
        elif cons2 == '전갈':
            return 62.5
        elif cons2 == '사수':
            return 37.5
        elif cons2 == '염소':
            return 100
        elif cons2 == '물병':
            return 37.5
        elif cons2 == '물고기':
            return 25
    elif cons1 == '천칭':
        if cons2 == '양':
            return 62.5
        elif cons2 == '황소':
            return 25
        elif cons2 == '쌍둥이':
            return 100
        elif cons2 == '게':
            return 37.5
        elif cons2 == '사자':
            return 62.5
        elif cons2 == '처녀':
            return 37.5
        elif cons2 == '천칭':
            return 100
        elif cons2 == '전갈':
            return 75
        elif cons2 == '사수':
            return 62.5
        elif cons2 == '염소':
            return 25
        elif cons2 == '물병':
            return 87.5
        elif cons2 == '물고기':
            return 37.5
    elif cons1 == '전갈':
        if cons2 == '양':
            return 12.5
        elif cons2 == '황소':
            return 25
        elif cons2 == '쌍둥이':
            return 37.5
        elif cons2 == '게':
            return 100
        elif cons2 == '사자':
            return 37.5
        elif cons2 == '처녀':
            return 50
        elif cons2 == '천칭':
            return 25
        elif cons2 == '전갈':
            return 87.5
        elif cons2 == '사수':
            return 12.5
        elif cons2 == '염소':
            return 50
        elif cons2 == '물병':
            return 75
        elif cons2 == '물고기':
            return 87.5
    elif cons1 == '사수':
        if cons2 == '양':
            return 100
        elif cons2 == '황소':
            return 12.5
        elif cons2 == '쌍둥이':
            return 62.5
        elif cons2 == '게':
            return 12.5
        elif cons2 == '사자':
            return 87.5
        elif cons2 == '처녀':
            return 25
        elif cons2 == '천칭':
            return 62.5
        elif cons2 == '전갈':
            return 12.5
        elif cons2 == '사수':
            return 87.5
        elif cons2 == '염소':
            return 75
        elif cons2 == '물병':
            return 62.5
        elif cons2 == '물고기':
            return 37.5
    elif cons1 == '염소':
        if cons2 == '양':
            return 75
        elif cons2 == '황소':
            return 100
        elif cons2 == '쌍둥이':
            return 75
        elif cons2 == '게':
            return 62.5
        elif cons2 == '사자':
            return 75
        elif cons2 == '처녀':
            return 100
        elif cons2 == '천칭':
            return 75
        elif cons2 == '전갈':
            return 62.5
        elif cons2 == '사수':
            return 75
        elif cons2 == '염소':
            return 87.5
        elif cons2 == '물병':
            return 25
        elif cons2 == '물고기':
            return 50
    elif cons1 == '물병':
        if cons2 == '양':
            return 50
        elif cons2 == '황소':
            return 12.5
        elif cons2 == '쌍둥이':
            return 100
        elif cons2 == '게':
            return 12.5
        elif cons2 == '사자':
            return 25
        elif cons2 == '처녀':
            return 12.5
        elif cons2 == '천칭':
            return 87.5
        elif cons2 == '전갈':
            return 37.5
        elif cons2 == '사수':
            return 50
        elif cons2 == '염소':
            return 37.5
        elif cons2 == '물병':
            return 100
        elif cons2 == '물고기':
            return 12.5
    elif cons1 == '물고기':
        if cons2 == '양':
            return 25
        elif cons2 == '황소':
            return 62.5
        elif cons2 == '쌍둥이':
            return 12.5
        elif cons2 == '게':
            return 100
        elif cons2 == '사자':
            return 12.5
        elif cons2 == '처녀':
            return 62.5
        elif cons2 == '천칭':
            return 37.5
        elif cons2 == '전갈':
            return 100
        elif cons2 == '사수':
            return 25
        elif cons2 == '염소':
            return 62.5
        elif cons2 == '물병':
            return 12.5
        elif cons2 == '물고기':
            return 87.5
