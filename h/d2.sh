python3 dump.py $1 $2 | grep -v "^$" | tr '\n' ' ' | sed 's/===== PAGE/\n\n===== PAGE/g; s/--- existing questions:/\n--- existing:/g; s/ \* /\n * /g'
