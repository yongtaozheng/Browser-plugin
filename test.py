import sys, os, re
from subprocess import check_output
branch = check_output(['git', 'symbolic-ref', '--short', 'HEAD']).strip()
print (branch.decode("utf-8"))
os.system("pause")