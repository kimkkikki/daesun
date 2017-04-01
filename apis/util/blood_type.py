def blood_chemistry(type1, type2):
    if type1 == 'A':
        if type2 == 'A':
            return 82
        elif type2 == 'B':
            return 64
        elif type2 == 'O':
            return 95
        elif type2 == 'AB':
            return 47
        else:
            return 0
    if type1 == 'B':
        if type2 == 'A':
            return 52
        elif type2 == 'B':
            return 87
        elif type2 == 'O':
            return 67
        elif type2 == 'AB':
            return 63
        else:
            return 0
    if type1 == 'O':
        if type2 == 'A':
            return 80
        elif type2 == 'B':
            return 75
        elif type2 == 'O':
            return 68
        elif type2 == 'AB':
            return 50
        else:
            return 0
    if type1 == 'AB':
        if type2 == 'A':
            return 65
        elif type2 == 'B':
            return 70
        elif type2 == 'O':
            return 60
        elif type2 == 'AB':
            return 75
        else:
            return 0
