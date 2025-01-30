import pygame
import time
import random
pygame.font.init()

#constants
WIDTH, HEIGHT = 1000, 800
PLAYER_WIDTH = 50
PLAYER_HEIGHT = 70
PLAYER_VEL = 5
STAR_WIDTH = 15
STAR_HEIGHT = 20
STAR_VEL = 2
FONT = pygame.font.SysFont("helvetica", 30 )

#initialize the display
WIN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Space Dodge")

#load images
BG = pygame.transform.scale(pygame.image.load("bg.jpeg"), (WIDTH, HEIGHT))
PLAYER_IMG = pygame.image.load("goji.png")
PLAYER_IMG = pygame.transform.scale(PLAYER_IMG, (PLAYER_WIDTH, PLAYER_HEIGHT))
STAR_IMG = pygame.image.load("jade.png")
STAR_IMG = pygame.transform.scale(STAR_IMG, (STAR_WIDTH, STAR_HEIGHT))

def draw(player_rect, elapsed_time, stars):
    WIN.blit(BG, (0, 0))

    WIN.blit(PLAYER_IMG, (player_rect.x, player_rect.y))

    time_text = FONT.render(f"Time: {round(elapsed_time)}s", 1, "white")
    WIN.blit(time_text, (10, 10))

    for star in stars:
        WIN.blit(STAR_IMG, (star.x, star.y))

    pygame.display.update()


def main():
    run = True

    clock = pygame.time.Clock()

    start_time = time.time()
    elapsed_time = 0

    player_rect = pygame.Rect(200, HEIGHT - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT)

    star_add_increment = 2000
    star_count = 0

    stars = []
    hit = False

    while run:
        star_count += clock.tick(60)
        elapsed_time = time.time() - start_time

        if star_count > star_add_increment:
            for _ in range(2):
                star_x = random.randint(0, WIDTH - STAR_WIDTH)
                star = pygame.Rect(star_x, -STAR_HEIGHT, STAR_WIDTH, STAR_HEIGHT)
                stars.append(star)

            star_add_increment = max(200, star_add_increment - 25)
            star_count = 0

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                break

        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] and player_rect.x >= 0:
            player_rect.x -= PLAYER_VEL
        if keys[pygame.K_RIGHT] and player_rect.x + PLAYER_WIDTH <= WIDTH:
            player_rect.x += PLAYER_VEL

        for star in stars[:]:
            star.y += STAR_VEL
            if star.y > HEIGHT:
                stars.remove(star)
            elif star.y + star.height >= player_rect.y and star.colliderect(player_rect):
                stars.remove(star)
                hit = True
                break

        if hit:
            lost_text = FONT.render("You lost! I love you, E.V.W!<3", 1, "white")
            WIN.blit(lost_text, (WIDTH /2 - lost_text.get_width() / 2, HEIGHT / 2 - lost_text.get_height() / 2))
            pygame.display.update()
            pygame.time.delay(4000)
            break

        draw(player_rect, elapsed_time, stars)

    
    pygame.quit()

if __name__ == "__main__":
    main()