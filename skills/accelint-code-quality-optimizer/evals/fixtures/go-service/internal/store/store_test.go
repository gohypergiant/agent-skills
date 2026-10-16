package store

import (
	"testing"
	"time"
)

// TestCount plants a sleep in a test (sleepInTests 1). Its fmt.Println must not count as a print call.
func TestCount(t *testing.T) {
	s := New()
	time.Sleep(time.Millisecond)
	if s.Count() != 0 {
		t.Fatal("expected an empty store")
	}
}
