def blood_chemistry(type1, type2):
    if type1 == 'A':
        if type2 == 'A':
            return 82
        elif type2 == 'B':
            return 52
        elif type2 == 'O':
            return 80
        elif type2 == 'AB':
            return 65
        else:
            return 0
    if type1 == 'B':
        if type2 == 'A':
            return 64
        elif type2 == 'B':
            return 77
        elif type2 == 'O':
            return 75
        elif type2 == 'AB':
            return 90
        else:
            return 0
    if type1 == 'O':
        if type2 == 'A':
            return 95
        elif type2 == 'B':
            return 67
        elif type2 == 'O':
            return 68
        elif type2 == 'AB':
            return 60
        else:
            return 0
    if type1 == 'AB':
        if type2 == 'A':
            return 47
        elif type2 == 'B':
            return 63
        elif type2 == 'O':
            return 50
        elif type2 == 'AB':
            return 70
        else:
            return 0
