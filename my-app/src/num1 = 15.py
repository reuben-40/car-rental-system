num1 = 15
num2 = 7
if num1 > num2:
 print("First number is greater than second number")
 print("I am outside the IF block")

#Another exercise
x=1
while x < 10:
 print(x)
 x=x+1

#Exercise 3
age = int(input("Enter your age:"))
ticket_type = input("Enter your ticket type")

if age >= 18 and age <= 35:
    if ticket_type == "Ordinary":
        price = 5000
    elif ticket_type == "VIP":
        price = 7000
    else:
        price = 0

elif age >=36 and  age <= 50:
   if ticket_type == "Ordinary":
       price == 10000 # type: ignore
   elif ticket_type == "VIP":
       price == 12000 # type: ignore
   else:
      price = 0

elif age >= 51 and age <= 70:
   if ticket_type == "Ordinary":
       price = 15000
   elif ticket_type == "VIP":
       price = 27000 
else:
   price = 0

#Another exercise
age = int(input("Enter your age"))

if age == 0 and age > 101:
    print("Invalid")
elif age == 1 and age <= 18:
    print("Young")
elif age == 19 and age <= 35:
    print(" Youth")
elif age == 26 and age <= 50:
    print("Adult")
elif age == 51 and age <= 70:
    print("Old")
elif age == 71 and age <= 100:
    print("Senior citizen")


#Another Exercise
num1(int("Key in your first number"))
num2(int("Key in your second number"))
if num1 % 2 == 0:
    print("Your first number" , num1, "is even")
else:
    print("Your first number" ,num1, "is odd")

#Another exercise
def area(radius):
    pi=3.142
    result=pi * radius * radius
    return round(result, 2)

#Another exercise
def area(length, width):
    result=length * width
    return result








    
    


