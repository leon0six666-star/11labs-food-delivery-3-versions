import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  AlertTriangle, 
  Plus, 
  X, 
  Search,
  AlertCircle,
  CheckCircle2,
  Nut,
  Milk,
  Wheat,
  Fish,
  Egg,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface AllergenInfo {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  symptoms: string[];
  icon: any;
  color: string;
  avoidanceList: string[]; // Ingredients to avoid
  crossContamination: boolean; // Whether cross-contamination is a concern
  emergencyMeds: string[]; // Emergency medications (e.g., EpiPen)
}

interface UserAllergenProfile {
  userId: string;
  allergens: AllergenInfo[];
  emergencyContact: {
    name: string;
    phone: string;
  };
  medicalAlert: boolean;
  lastUpdated: Date;
}

interface AllergenTrackerProps {
  onProfileUpdate: (profile: UserAllergenProfile) => void;
  initialProfile?: UserAllergenProfile;
}

const COMMON_ALLERGENS: Omit<AllergenInfo, 'severity' | 'symptoms' | 'emergencyMeds'>[] = [
  {
    id: 'peanuts',
    name: 'Peanuts',
    icon: Nut,
    color: 'red',
    avoidanceList: ['peanuts', 'peanut oil', 'peanut butter', 'groundnuts', 'arachis oil'],
    crossContamination: true
  },
  {
    id: 'tree-nuts',
    name: 'Tree Nuts',
    icon: Nut,
    color: 'orange',
    avoidanceList: ['almonds', 'cashews', 'walnuts', 'pecans', 'pistachios', 'brazil nuts', 'hazelnuts', 'macadamia nuts'],
    crossContamination: true
  },
  {
    id: 'dairy',
    name: 'Dairy/Milk',
    icon: Milk,
    color: 'blue',
    avoidanceList: ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'whey', 'casein', 'lactose'],
    crossContamination: false
  },
  {
    id: 'gluten',
    name: 'Gluten/Wheat',
    icon: Wheat,
    color: 'yellow',
    avoidanceList: ['wheat', 'barley', 'rye', 'spelt', 'kamut', 'triticale', 'bulgur', 'semolina'],
    crossContamination: true
  },
  {
    id: 'eggs',
    name: 'Eggs',
    icon: Egg,
    color: 'amber',
    avoidanceList: ['eggs', 'albumin', 'lecithin', 'lysozyme', 'mayonnaise', 'meringue'],
    crossContamination: false
  },
  {
    id: 'shellfish',
    name: 'Shellfish',
    icon: Fish,
    color: 'teal',
    avoidanceList: ['shrimp', 'crab', 'lobster', 'crayfish', 'prawns', 'langostino'],
    crossContamination: true
  },
  {
    id: 'fish',
    name: 'Fish',
    icon: Fish,
    color: 'cyan',
    avoidanceList: ['salmon', 'tuna', 'bass', 'flounder', 'cod', 'anchovy', 'fish sauce', 'worcestershire'],
    crossContamination: true
  },
  {
    id: 'soy',
    name: 'Soy',
    icon: Nut,
    color: 'green',
    avoidanceList: ['soybeans', 'soy sauce', 'tofu', 'tempeh', 'miso', 'soybean oil', 'lecithin'],
    crossContamination: false
  },
  {
    id: 'sesame',
    name: 'Sesame',
    icon: Nut,
    color: 'brown',
    avoidanceList: ['sesame seeds', 'sesame oil', 'tahini', 'halvah', 'hummus'],
    crossContamination: true
  }
];

const SEVERITY_CONFIG = {
  'mild': { color: 'green', label: 'Mild', description: 'Minor discomfort' },
  'moderate': { color: 'yellow', label: 'Moderate', description: 'Noticeable symptoms' },
  'severe': { color: 'orange', label: 'Severe', description: 'Significant reaction' },
  'life-threatening': { color: 'red', label: 'Life-Threatening', description: 'Anaphylaxis risk' }
};

const AllergenTracker = ({ onProfileUpdate, initialProfile }: AllergenTrackerProps) => {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserAllergenProfile>(
    initialProfile || {
      userId: 'current-user',
      allergens: [],
      emergencyContact: { name: '', phone: '' },
      medicalAlert: false,
      lastUpdated: new Date()
    }
  );
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAllergen, setSelectedAllergen] = useState<typeof COMMON_ALLERGENS[0] | null>(null);

  const addAllergen = (allergenTemplate: typeof COMMON_ALLERGENS[0], severity: AllergenInfo['severity']) => {
    const newAllergen: AllergenInfo = {
      ...allergenTemplate,
      severity,
      symptoms: [], // User can add specific symptoms
      emergencyMeds: severity === 'life-threatening' ? ['EpiPen'] : []
    };

    const updatedProfile = {
      ...profile,
      allergens: [...profile.allergens, newAllergen],
      lastUpdated: new Date()
    };

    setProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
    setShowAddForm(false);
    setSelectedAllergen(null);

    toast({
      title: "Allergen Added",
      description: `${allergenTemplate.name} allergy added with ${severity} severity.`,
    });
  };

  const removeAllergen = (allergenId: string) => {
    const updatedProfile = {
      ...profile,
      allergens: profile.allergens.filter(a => a.id !== allergenId),
      lastUpdated: new Date()
    };

    setProfile(updatedProfile);
    onProfileUpdate(updatedProfile);

    toast({
      title: "Allergen Removed",
      description: "Allergen removed from your profile.",
    });
  };

  const updateEmergencyContact = (name: string, phone: string) => {
    const updatedProfile = {
      ...profile,
      emergencyContact: { name, phone },
      lastUpdated: new Date()
    };

    setProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
  };

  const toggleMedicalAlert = () => {
    const updatedProfile = {
      ...profile,
      medicalAlert: !profile.medicalAlert,
      lastUpdated: new Date()
    };

    setProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
  };

  const filteredAllergens = COMMON_ALLERGENS.filter(allergen =>
    allergen.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !profile.allergens.some(pa => pa.id === allergen.id)
  );

  const checkFoodSafety = (foodItem: any) => {
    const conflicts: string[] = [];
    
    profile.allergens.forEach(allergen => {
      allergen.avoidanceList.forEach(ingredient => {
        if (foodItem.ingredients?.some((ing: string) => 
          ing.toLowerCase().includes(ingredient.toLowerCase())
        )) {
          conflicts.push(`${allergen.name}: Contains ${ingredient}`);
        }
      });

      // Check cross-contamination warnings
      if (allergen.crossContamination && foodItem.crossContaminationWarning) {
        conflicts.push(`${allergen.name}: Cross-contamination risk`);
      }
    });

    return conflicts;
  };

  const getSeverityIcon = (severity: AllergenInfo['severity']) => {
    switch (severity) {
      case 'mild': return CheckCircle2;
      case 'moderate': return Info;
      case 'severe': return AlertTriangle;
      case 'life-threatening': return AlertCircle;
      default: return Info;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Allergen Profile Management
            {profile.medicalAlert && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Medical Alert
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Emergency Contact Name</Label>
              <Input
                value={profile.emergencyContact.name}
                onChange={(e) => updateEmergencyContact(e.target.value, profile.emergencyContact.phone)}
                placeholder="Emergency contact name"
              />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact Phone</Label>
              <Input
                value={profile.emergencyContact.phone}
                onChange={(e) => updateEmergencyContact(profile.emergencyContact.name, e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.medicalAlert}
                onChange={toggleMedicalAlert}
                className="rounded"
              />
              <span className="text-sm">Enable medical alert notifications for severe allergies</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Current Allergens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Your Allergens ({profile.allergens.length})
            </div>
            <Button onClick={() => setShowAddForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Allergen
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile.allergens.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No allergens added yet. Click "Add Allergen" to start building your profile.
            </p>
          ) : (
            <div className="space-y-3">
              {profile.allergens.map((allergen) => {
                const IconComponent = allergen.icon;
                const SeverityIcon = getSeverityIcon(allergen.severity);
                const severityConfig = SEVERITY_CONFIG[allergen.severity];
                
                return (
                  <div key={allergen.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <IconComponent className={`h-6 w-6 text-${allergen.color}-500`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{allergen.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-${severityConfig.color}-700 border-${severityConfig.color}-300`}
                          >
                            <SeverityIcon className="h-3 w-3 mr-1" />
                            {severityConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Avoid: {allergen.avoidanceList.slice(0, 3).join(', ')}
                          {allergen.avoidanceList.length > 3 && ` +${allergen.avoidanceList.length - 3} more`}
                        </p>
                        {allergen.crossContamination && (
                          <Badge variant="secondary" className="text-xs">
                            ⚠️ Cross-contamination risk
                          </Badge>
                        )}
                        {allergen.emergencyMeds.length > 0 && (
                          <Badge variant="destructive" className="text-xs ml-1">
                            🚨 {allergen.emergencyMeds.join(', ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeAllergen(allergen.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Allergen Form */}
      {showAddForm && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add New Allergen</span>
              <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for allergens..."
                className="pl-10"
              />
            </div>

            {/* Available Allergens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAllergens.map((allergen) => {
                const IconComponent = allergen.icon;
                return (
                  <div 
                    key={allergen.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-white hover:shadow-sm transition-all"
                    onClick={() => setSelectedAllergen(allergen)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className={`h-5 w-5 text-${allergen.color}-500`} />
                      <span className="font-medium">{allergen.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {allergen.avoidanceList.slice(0, 2).join(', ')}...
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Severity Selection */}
            {selectedAllergen && (
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h4 className="font-medium mb-3">
                  Select severity for {selectedAllergen.name}:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SEVERITY_CONFIG).map(([severity, config]) => {
                    const SeverityIcon = getSeverityIcon(severity as AllergenInfo['severity']);
                    return (
                      <Button
                        key={severity}
                        onClick={() => addAllergen(selectedAllergen, severity as AllergenInfo['severity'])}
                        variant="outline"
                        className={`justify-start h-auto p-3 hover:bg-${config.color}-50 hover:border-${config.color}-300`}
                      >
                        <SeverityIcon className={`h-4 w-4 mr-2 text-${config.color}-500`} />
                        <div className="text-left">
                          <div className="font-medium text-sm">{config.label}</div>
                          <div className="text-xs text-gray-500">{config.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Profile Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl text-blue-600">{profile.allergens.length}</div>
              <div className="text-blue-600">Total Allergens</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-red-600">
                {profile.allergens.filter(a => a.severity === 'life-threatening').length}
              </div>
              <div className="text-red-600">Life-Threatening</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-orange-600">
                {profile.allergens.filter(a => a.crossContamination).length}
              </div>
              <div className="text-orange-600">Cross-Contamination</div>
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-xs text-blue-600 text-center">
            Last updated: {profile.lastUpdated.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to check if a food item is safe for a user's allergen profile
export const checkAllergenSafety = (foodItem: any, allergenProfile: UserAllergenProfile) => {
  const conflicts: Array<{allergen: string, reason: string, severity: string}> = [];
  
  allergenProfile.allergens.forEach(allergen => {
    // Check ingredients
    allergen.avoidanceList.forEach(ingredient => {
      if (foodItem.ingredients?.some((ing: string) => 
        ing.toLowerCase().includes(ingredient.toLowerCase())
      )) {
        conflicts.push({
          allergen: allergen.name,
          reason: `Contains ${ingredient}`,
          severity: allergen.severity
        });
      }
    });

    // Check allergen tags
    if (foodItem.allergens?.includes(allergen.id)) {
      conflicts.push({
        allergen: allergen.name,
        reason: 'Listed as allergen',
        severity: allergen.severity
      });
    }

    // Check cross-contamination
    if (allergen.crossContamination && foodItem.crossContaminationRisk?.includes(allergen.id)) {
      conflicts.push({
        allergen: allergen.name,
        reason: 'Cross-contamination risk',
        severity: allergen.severity
      });
    }
  });

  return {
    isSafe: conflicts.length === 0,
    conflicts,
    hasLifeThreateningRisk: conflicts.some(c => c.severity === 'life-threatening'),
    hasSevereRisk: conflicts.some(c => c.severity === 'severe')
  };
};

export default AllergenTracker;