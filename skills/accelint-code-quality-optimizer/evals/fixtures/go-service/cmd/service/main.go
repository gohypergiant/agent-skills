// Package main is the clean package of the fixture: every metric should be zero here.
package main

import (
	"log"

	"fixture/service/internal/store"
)

func main() {
	s := store.New()
	log.Println("items:", s.Count())
}
