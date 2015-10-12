__author__ = 'GengZhenglin'
import json
import codecs
cleaned_lists = [[] for i in range(31)]
gre_file = open('obj.json', 'r')
ori_obj = json.loads(gre_file.read())

def clean_word(word):
    global cleaned_lists
    new_word = dict()
    new_word['english'] = word['word']
    new_word['meanings'] = []
    for meaning in word['meanings']:
        new_meaning = dict()
        new_meaning['explanation'] = meaning['explanation']
        if hasattr(meaning, 'example'):
            new_meaning['example'] = meaning['example']
        else:
            new_meaning['example'] = ''
        new_meaning['homonyms'] = ",".join(meaning['homo'])
        new_meaning['synonyms'] = ",".join(meaning['syno'])
        new_meaning['antonyms'] = ",".join(meaning['anto'])
        new_word['meanings'].append(new_meaning)
    index = int(word['cid'])-1
    cleaned_lists[index].append(new_word)


def clean_and_save_all(obj):
    global cleaned_lists
    for ori_word in ori_obj:
        clean_word(ori_word)
    for i in range(31):
        name = 'list'+str(i+1)+".json"
        f = codecs.open(name, "w", "utf-8")
        json.dump(cleaned_lists[i], f, ensure_ascii = False)


clean_and_save_all(ori_obj)
# def save_list(obj):
#
# def save_lists(obj):
#
# def clean_word(word):
#


