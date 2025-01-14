from tkinter import *
from tkinter import ttk
import pyshorteners  # pip install pyshorteners
import webbrowser

# Function to short URL
def shorten_url(url):
    try:
        short_url = pyshorteners.Shortener().tinyurl.short(url)
        output_url.set(short_url)
    except:
        print("Invalid URL")

# Function to copy URL
def copy_url(url):
    try:
        root.clipboard_clear()
        root.clipboard_append(url)
        print("URL Copied to clipboard")
    except:
        print("Invalid URL")

# Function to open URL
def open_url(url):
    try:
        webbrowser.open(url)
    except:
        print("Invalid URL")

# Main window
root = Tk()
root.title("TinyVerse: Shrinking the digital universe -developed by SnehaGhosh(Technical_Isopod075)")
root.geometry("700x400")
root.resizable(0, 0)
root.configure(bg="#f0f8ff")  # Light blue background

# Style customization
style = ttk.Style()
style.theme_use("clam")
style.configure("TButton", font=("Arial", 12, "bold"), background="#4682b4", foreground="white")
style.map("TButton",
          background=[("active", "#5f9ea0")],
          foreground=[("active", "#ffffff")])
style.configure("TLabel", background="#f0f8ff", font=("Arial", 12))

# Title label
label = ttk.Label(root, text="TinyVerse - Short URL for LakshyOrbit", font=('Arial', 16, 'bold'))
label.grid(row=0, column=0, columnspan=2, pady=20)

# Label for input URL
url_input = ttk.Label(root, text="Enter URL:")
url_input.grid(row=1, column=0, pady=20, padx=20)

# Input field for URL
url = StringVar()
url_entry = ttk.Entry(root, textvariable=url, width=40)
url_entry.grid(row=1, column=1, pady=20, padx=20)

# Button for Short URL
shorten_button = ttk.Button(root, text="Shorten", command=lambda: shorten_url(url.get()))
shorten_button.grid(row=2, column=0, columnspan=2, pady=10)

# Label for shortened URL
shortened_url_label = ttk.Label(root, text="Shortened URL:")
shortened_url_label.grid(row=3, column=0, pady=20, padx=20)

# Output field for shortened URL
output_url = StringVar()
output_url_entry = ttk.Entry(root, textvariable=output_url, width=40)
output_url_entry.grid(row=3, column=1, pady=20, padx=20)

# Button for Copy URL
copy_button = ttk.Button(root, text="Copy", command=lambda: copy_url(output_url.get()))
copy_button.grid(row=4, column=0, pady=10, padx=10)

# Button for Open URL
open_button = ttk.Button(root, text="Open", command=lambda: open_url(output_url.get()))
open_button.grid(row=4, column=1, pady=10, padx=10)

# Adjusting grid layout to center all elements
for i in range(5):
    root.grid_rowconfigure(i, weight=1, uniform="equal")
root.grid_columnconfigure(0, weight=1, uniform="equal")
root.grid_columnconfigure(1, weight=1, uniform="equal")

root.mainloop()
