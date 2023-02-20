package main

import (
	"context"
	"fmt"
	"github.com/chromedp/chromedp"
)

type WProduct struct {
	PageType string
	Ptype    []string
	Pbrand   string
	ProdID   []uint
	Value    []string
	Discount string
	Delivery string
}

type Product struct {
	Name     string
	Brand    string
	ID       uint
	Price    uint
	Discount string
	Delivery string
}

func main() {

	allocatorContext, cancel := chromedp.NewRemoteAllocator(context.Background(), "http://browser:9222")
	defer cancel()

	// create context
	ctx, cancel := chromedp.NewContext(allocatorContext)
	defer cancel()

	var res string

	err := chromedp.Run(ctx,
		chromedp.Navigate(`https://mk.ru`),
		chromedp.OuterHTML("body", &res, chromedp.ByQuery),
	)

	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(res)
}
