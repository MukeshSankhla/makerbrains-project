
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LazyImage from "@/components/LazyImage";
import type { Product } from "@/contexts/ShopContext";
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const { toast } = useToast();

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const snap = await getDocs(collection(db, "products"));
      // Adapt stored string id to number for legacy compatibility
      setProducts(
        snap.docs.map((d) => {
          const data = d.data() as any;
          // Ensure id is a number (for legacy compatibility)
          let id: number;
          if (typeof data.id === "number") {
            id = data.id;
          } else if (typeof data.id === "string" && !isNaN(Number(data.id))) {
            id = Number(data.id);
          } else {
            // fallback: use Firestore doc ID as number (hash code)
            id =
              d.id
                .split("")
                .reduce((acc, v) => acc + v.charCodeAt(0), 0) % 1000000000;
          }
          return { ...data, id };
        })
      );
    } catch (err) {
      toast({
        title: "Load error",
        description: "Failed to load products from database.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleStartEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm({
      ...product,
      features: product.features || [],
      specs: product.specs || [],
    });
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditForm({
      title: "",
      description: "",
      features: [],
      specs: [],
      price: 0,
      image: "",
      stock: 0,
    });
  };

  const handleSave = async () => {
    try {
      if (!editForm.title || !editForm.description || !editForm.price) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      if (isAdding) {
        // Add product to Firestore
        const docRef = await addDoc(collection(db, "products"), {
          ...editForm,
          id: Date.now(), // unique numeric id for compatibility
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        toast({
          title: "Product Added",
          description: "Product has been successfully added to the shop.",
        });
        setIsAdding(false);
        setEditForm({});
        fetchProducts();
      } else if (isEditing) {
        // Find Firestore doc with id matching our product's id
        const snap = await getDocs(collection(db, "products"));
        let found = null;
        for (let d of snap.docs) {
          const data = d.data();
          if (
            data.id === isEditing ||
            data.id === String(isEditing) ||
            d.id === String(isEditing)
          ) {
            found = d.id;
            break;
          }
        }
        if (!found) throw new Error("Could not find product in database");
        await updateDoc(doc(db, "products", found), {
          ...editForm,
          updated_at: new Date().toISOString(),
        });
        toast({
          title: "Product Updated",
          description: "Product has been successfully updated.",
        });
        setIsEditing(null);
        setEditForm({});
        fetchProducts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        // Find Firestore doc with id matching our product's id
        const snap = await getDocs(collection(db, "products"));
        let found = null;
        for (let d of snap.docs) {
          const data = d.data();
          if (
            data.id === id ||
            data.id === String(id) ||
            d.id === String(id)
          ) {
            found = d.id;
            break;
          }
        }
        if (!found) throw new Error("Could not find product in database");
        await deleteDoc(doc(db, "products", found));
        toast({
          title: "Product Deleted",
          description: "Product has been successfully deleted.",
        });
        fetchProducts();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setEditForm({});
  };

  const updateFormField = (field: keyof Product, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: "features" | "specs", value: string) => {
    const array = value.split("\n").filter((item) => item.trim() !== "");
    setEditForm((prev) => ({ ...prev, [field]: array }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Products</h1>
        <Button
          onClick={handleStartAdd}
          disabled={isAdding || isEditing !== null}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Product Title"
              value={editForm.title || ""}
              onChange={(e) => updateFormField("title", e.target.value)}
            />
            <Textarea
              placeholder="Product Description"
              value={editForm.description || ""}
              onChange={(e) => updateFormField("description", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Price"
                value={editForm.price || ""}
                onChange={(e) =>
                  updateFormField("price", parseFloat(e.target.value) || 0)
                }
              />
              <Input
                type="number"
                placeholder="Stock"
                value={editForm.stock || ""}
                onChange={(e) =>
                  updateFormField("stock", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <Input
              placeholder="Image URL"
              value={editForm.image || ""}
              onChange={(e) => updateFormField("image", e.target.value)}
            />
            <Textarea
              placeholder="Features (one per line)"
              value={editForm.features?.join("\n") || ""}
              onChange={(e) => updateArrayField("features", e.target.value)}
            />
            <Textarea
              placeholder="Specifications (one per line)"
              value={editForm.specs?.join("\n") || ""}
              onChange={(e) => updateArrayField("specs", e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            {isEditing === product.id ? (
              <CardContent className="p-4 space-y-4">
                <Input
                  value={editForm.title || ""}
                  onChange={(e) => updateFormField("title", e.target.value)}
                />
                <Textarea
                  value={editForm.description || ""}
                  onChange={(e) =>
                    updateFormField("description", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={editForm.price || ""}
                    onChange={(e) =>
                      updateFormField(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                  <Input
                    type="number"
                    value={editForm.stock || ""}
                    onChange={(e) =>
                      updateFormField(
                        "stock",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <Input
                  value={editForm.image || ""}
                  onChange={(e) => updateFormField("image", e.target.value)}
                />
                <Textarea
                  placeholder="Features (one per line)"
                  value={editForm.features?.join("\n") || ""}
                  onChange={(e) => updateArrayField("features", e.target.value)}
                />
                <Textarea
                  placeholder="Specs (one per line)"
                  value={editForm.specs?.join("\n") || ""}
                  onChange={(e) => updateArrayField("specs", e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <div className="aspect-video relative">
                  <LazyImage
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    {product.title}
                  </CardTitle>
                  <div className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                    {product.description}
                  </p>
                  <div className="text-sm">
                    <span
                      className={
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => handleStartEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;

