#include<stdio.h>
#include<stdlib.h>
#include<string.h>

/*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */

int *levenstein(char *from, char *to) {
  int fromLength = strlen(from) + 1;
  int toLength = strlen(to) + 1;
  int size = fromLength * toLength;
  int x = 0;
  int y = 0;
  int X = 0;
  int Y = 0;
  int crow = 0;
  int prow = 0;
  int del, ins, sub;
  int *grid = malloc(sizeof(int) * size);
  grid[0] = 0;
  while (++x < toLength) grid[x] = x;
  while (++y < fromLength) {
    X = x = 0;
    prow = crow;
    crow = y * toLength;
    grid[crow + x] = y;
    while (++x < toLength) {
      del = grid[prow + x] + 1;
      ins = grid[crow + X] + 1;
      sub = grid[prow + X] + (from[Y] == to[X] ? 0 : 1);
      grid[crow + x] = del < ins ?
                        (del < sub ?
                          del : sub) :
                        (ins < sub ?
                          ins : sub);
      ++X;
    };
    Y = y;
  }
  return grid;
}

int main(int argc, char *argv[])
{
  if (argc == 3) {
    int *result = levenstein(argv[1], argv[2]);
    int size = (strlen(argv[1]) + 1) * (strlen(argv[2]) + 1);
    printf("%i\n", result[size - 1]);
  }
}