import matplotlib
matplotlib.use('Agg')  


import matplotlib.pyplot as plt
from base import *
# def create_line_graph(data,path):
#     x = data["starttime"].to_list()
#     y = data["Total_Drops"].to_list()

#     # Create a line plot
#     plt.plot(x, y, label=data["Site_Name"].to_list()[0])

#     # Add labels and title
#     plt.xlabel('X-axis')
#     plt.ylabel('Y-axis')
#     plt.title('Line Graph Example')

#     plt.text(3, 8, 'Custom Text', fontsize=12, color='black')

#     # Add legend
#     plt.legend()

#     plt.xticks(rotation=45, ha='right')  
#     # plt.autoscale()
#     plt.axis('tight')

#     # Save the plot as a PDF file
#     plt.savefig(path)

#     # Show the plot (optional)
#     # plt.show()

def create_line_graph(x,y,data,path,hue):
    fig, ax = plt.subplots(figsize=(25, 20))
    sns.lineplot(x=x, y=y, data=data, hue=hue)
    plt.setp(ax.get_legend().get_texts(), fontsize='16') # for legend text
    plt.setp(ax.get_legend().get_title(), fontsize='22') # for legend title
    plt.close()
    # plt.legend(loc='upper left')

    # define filename with current date e.g. "2021-04-08.png"

    # save plot
    fig.savefig(path, dpi=fig.dpi)