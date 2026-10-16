// Package store holds the planted problems. Keep the comments in evals/expected/go-service-scorecard.json in sync.
package store

import (
	"context"
	"fmt"
	"os"
	"strconv"
)

// Store keeps items of any type. interface{} is planted: emptyInterfaces 1.
type Store struct {
	items []interface{}
}

func New() *Store { return &Store{} }

func (s *Store) Count() int { return len(s.items) }

// Load plants a %v error wrap (errorfWithV 1) and a defer inside a loop (deferInLoop 1).
func (s *Store) Load(names []string) error {
	for _, name := range names {
		f, err := os.Open(name)
		if err != nil {
			return fmt.Errorf("load %s: %v", name, err)
		}
		defer f.Close()
	}
	return nil
}

// Parse plants two ignored returns (ignoredErrors 2).
func (s *Store) Parse(raw string) int {
	n, _ := strconv.Atoi(raw)
	_ = s.flush()
	return n
}

func (s *Store) flush() error { return nil }

// Debug plants `ok == true` (staticcheck S1002), two fmt prints (printCalls 2), a vet printf
// mismatch (vet:printf 1) and a context.TODO (contextTodo 1).
func (s *Store) Debug(ok bool) {
	if ok == true {
		fmt.Println("debug", s.Count())
	}
	fmt.Printf("%d", "count")
	s.Reset(context.TODO())
}

// Reset plants a panic (panicCalls 1) and a goroutine with no visible lifetime (bareGoroutines 1).
func (s *Store) Reset(ctx context.Context) {
	if ctx == nil {
		panic("nil context")
	}
	s.items = nil
	go s.cleanup()
}

func (s *Store) cleanup() {}

// legacy plants a nolint directive (lintSuppressions 1); staticcheck still reports it unused (U1000).
//
//nolint:unused
func legacy() {}
