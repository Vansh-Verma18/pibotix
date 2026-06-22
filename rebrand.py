import os
import re

directories = ['app', 'components']

replacements = {
    'to-blue-400': 'to-red-600',
    'bg-blue-600/20': 'bg-red-600/15',
    'bg-blue-600/10': 'bg-red-600/10',
    'bg-blue-500/10': 'bg-primary/10',
    'bg-blue-500/20': 'bg-primary/15',
    'bg-blue-200/20': 'bg-white/5',
    'from-blue-200/20 to-blue-200/10': 'from-white/5 to-white/0',
    'from-blue-600/20': 'from-neutral-800/50',
    'from-purple-600/20 to-blue-600/20': 'from-red-600/20 to-orange-600/20',
    'from-emerald-600/20 to-teal-600/20': 'from-neutral-800/40 to-neutral-700/20',
    'from-blue-600/20 to-primary/20': 'from-red-600/20 to-primary/20',
    'text-blue-100': 'text-gray-300',
    'text-blue-400': 'text-red-400',
    'text-blue-500': 'text-primary',
    'bg-blue-500': 'bg-primary',
    'bg-blue-600': 'bg-primary',
    'hover:border-blue-500/50': 'hover:border-primary/50',
    'hover:text-blue-400': 'hover:text-red-400',
    'border-blue-500': 'border-primary',
}

files_changed = 0

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {path}")
                    files_changed += 1

print(f"Total files updated: {files_changed}")
