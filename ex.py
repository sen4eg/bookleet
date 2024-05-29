import matplotlib.pyplot as plt
import numpy as np

# Number of circles
num_circles = 1000

# Generate random positions for the circles
# Set the index of the circle to be highlighted
highlight_index = np.random.randint(0, num_circles)

# Create a figure and axis
fig, ax = plt.subplots()

# Plot all the circles
for i in range(num_circles):
    XOFFSET = 0.02
    YOFFSET = 0.02
    x = (i % 50) * XOFFSET + XOFFSET
    y = i // 50 * YOFFSET + YOFFSET
    if i == highlight_index:
        # Highlight the selected circle with a different color and larger size
        circle = plt.Circle((x, y), 0.01, color='red', edgecolor='black', linewidth=1.5)
    else:
        circle = plt.Circle((x, y), 0.01, color='blue', alpha=0.5)
    ax.add_patch(circle)

# Set the aspect of the plot to be equal
ax.set_aspect('equal', adjustable='box')
plt.xlim(0, 1.1)
plt.ylim(0, 1.1)
plt.axis('off')  # Turn off the axis

# Show the plot
plt.show()