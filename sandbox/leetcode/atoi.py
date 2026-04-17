class Solution:
    def myAtoi(self, s: str) -> int:
        value = 0
        hasNeg = False
        hasPos = False 
        numberFound = False
        SPACE = 32
        MINUS = 45
        PLUS = 43
        ZERO = 48
        NINE = 57
        LIMIT = 2147483648
        
        for i in range(len(s)):
            intOfChar = ord(s[i])

            if intOfChar == SPACE:
                if hasPos or hasNeg or numberFound:
                    break
                continue

            if hasNeg == False and intOfChar == MINUS and value == 0 and not numberFound:
                hasNeg = True
                continue
            if hasPos == False and intOfChar == PLUS and value == 0 and not numberFound:
                hasPos = True
                continue

            if intOfChar < ZERO or intOfChar > NINE:
                break
            else: 
                numberFound = True

            if (intOfChar == MINUS and (numberFound or hasNeg)) or (hasNeg and hasPos):
                value = 0 
                break
            value *= 10
            value += intOfChar - ZERO  

        if not hasNeg:
            LIMIT = LIMIT - 1 

        if value > LIMIT:
            value = LIMIT

        if hasNeg:
            value *= -1

    
        return value 
        

