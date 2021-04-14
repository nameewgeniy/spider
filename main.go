package main

import (
	"fmt"
	"github.com/geziyor/geziyor"
	"github.com/geziyor/geziyor/client"
	"github.com/geziyor/geziyor/export"
	"regexp"
)

type Product struct {
	Name string
	Price string
	Brand string
	ID string
	Discount string
}

func main() {
	geziyor.NewGeziyor(&geziyor.Options{
		StartURLs: []string{"https://www.wildberries.ru/catalog/25807004/detail.aspx"},
		ParseFunc: parseMovies,
		Exporters: []export.Exporter{&export.JSON{}},
	}).Start()

}

func parseMovies(g *geziyor.Geziyor, r *client.Response) {

	//rePageType := regexp.MustCompile(`"PageType":.*"?`)
	reProductType := regexp.MustCompile(`"Ptype":.*?]`)
	reBrand := regexp.MustCompile(`"Pbrand":.*"?`)
	reID := regexp.MustCompile(`"ProdID":.*?]`)
	rePrice := regexp.MustCompile(`"Value":.*?]`)
	reDiscount := regexp.MustCompile(`"Discount":.*"?`)

	pr := Product{
		Name: string(reProductType.Find(r.Body)),
		Brand: string(reBrand.Find(r.Body)),
		Price: string(rePrice.Find(r.Body)),
		ID: string(reID.Find(r.Body)),
		Discount: string(reDiscount.Find(r.Body)),
	}

	fmt.Println(pr)
}