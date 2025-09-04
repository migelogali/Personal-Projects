import random

per_6_list = ["Angelina", "Jill", "Eli", "Marcus", "Ari", "Jaiden",
              "Zach", "Henry", "Kaylie", "Ava", "Alfred", "Luana", "Ama", "Cameron"]
class_layout_list = [None, None, None, None, None, None,
                     None, None, None, None, None, None, None, None]

for i in range(len(per_6_list)):
    j = random.randint(0, 13)
    if class_layout_list[j] == None:
        # restriction on Kaylie
        if i == 8:
            kaylie = False
            count = 0
            while kaylie == False and count < 100:
                if j > 5:
                    j = random.randint(0, 5)
                elif class_layout_list[j] != None:
                    j = random.randint(0, 5)
                elif j % 3 == 0:
                    if class_layout_list[j + 1] == per_6_list[6] or class_layout_list[j + 1] == per_6_list[7]:
                        j = random.randint(0, 5)
                    else:
                        kaylie = True
                elif j % 3 == 1:
                    if class_layout_list[j - 1] == per_6_list[6] or class_layout_list[j - 1] == per_6_list[7]:
                        if class_layout_list[j + 1] == per_6_list[6] or class_layout_list[j + 1] == per_6_list[7]:
                            j = random.randint(0, 5)
                        else:
                            kaylie = True
                    else:
                        kaylie = True
                else:
                    if class_layout_list[j - 1] == per_6_list[6] or class_layout_list[j - 1] == per_6_list[7]:
                        j = random.randint(0, 5)
                    else:
                        kaylie = True
                count += 1
        class_layout_list[j] = per_6_list[i]
    else:
        while class_layout_list[j] != None:
            j = random.randint(0, 13)
            # restriction on Kaylie
            if i == 8:
                kaylie = False
                count = 0
                while kaylie == False and count < 100:
                    if j > 5:
                        j = random.randint(0, 5)
                    elif class_layout_list[j] != None:
                        j = random.randint(0, 5)
                    elif j % 3 == 0:
                        if class_layout_list[j + 1] == per_6_list[6] or class_layout_list[j + 1] == per_6_list[7]:
                            j = random.randint(0, 5)
                        else:
                            kaylie = True
                    elif j % 3 == 1:
                        if class_layout_list[j - 1] == per_6_list[6] or class_layout_list[j - 1] == per_6_list[7]:
                            if class_layout_list[j + 1] == per_6_list[6] or class_layout_list[j + 1] == per_6_list[7]:
                                j = random.randint(0, 5)
                            else:
                                kaylie = True
                        else:
                            kaylie = True
                    else:
                        if class_layout_list[j - 1] == per_6_list[6] or class_layout_list[j - 1] == per_6_list[7]:
                            j = random.randint(0, 5)
                        else:
                            kaylie = True
                    count += 1
        class_layout_list[j] = per_6_list[i]


print()
print(str(class_layout_list[0:3]) +
      "           " + str(class_layout_list[3:6]))
print()
print(str(class_layout_list[6:9]) +
      "           " + str(class_layout_list[9:12]))
print()
print(str(class_layout_list[12:14]))
